import { setTimeout as sleep } from 'node:timers/promises';
import { AsyncQueue } from '@sapphire/async-queue';
import { request, type Dispatcher } from 'undici';
import { RateLimitData, RequestOptions } from '../REST.js';
import { HandlerRequestData, RequestManager, RouteData } from '../RequestManager.js';
import { ModrinthAPIError, type ModrinthErrorData, type OAuthErrorData } from '../errors/ModrinthAPIError.js';
import { HTTPError } from '../errors/HTTPError.js';
import { RateLimitError } from '../errors/RateLimitError.js';
import { RESTEvents } from '../utils/constants.js';
import { parseHeader, parseResponse } from '../utils/utils.js';
import { IHandler } from './IHandler.js';

/**
 * Invalid request limiting is done on a per-IP basis, not a per-token basis.
 * The best we can do is track invalid counts process-wide (on the theory that users could have multiple tokens run using
 * one process) rather than per-token. Therefore, store these at file scope rather than in the client's RESTManager object.
 */
let invalidCount = 0;
let invalidCountResetTime: number | null = null;

/**
 * The structure used to handle requests for a given bucket
 */
export class SequentialHandler implements IHandler {
    /**
     * The time this rate limit bucket will reset
     */
    private reset = -1;
    /**
     * The remaining number of requests that can be made before we are rate limited
     */
    private remaining = 1;
    /**
     * The total number of requests that can be made before we are rate limited
     */
    private limit = Number.POSITIVE_INFINITY;
    /**
     * The interface used to sequence async requests sequentially
     */
    #asyncQueue = new AsyncQueue();

    /**
     * @param manager - The request manager
     */
    public constructor(
        private readonly manager: RequestManager,
    ) {}

    /**
     * {@inheritDoc IHandler.inactive}
     */
    public get inactive(): boolean {
        return (
            this.#asyncQueue.remaining === 0 && !this.limited
        );
    }

    /**
     * If the rate limit bucket is currently limited
     */
    private get limited(): boolean {
        return this.manager.remaining <= 0 && Date.now() < this.manager.reset;
    }

    /**
     * The time until queued requests can continue
     */
    private get timeToReset(): number {
        return this.reset + this.manager.options.offset - Date.now();
    }

    /**
     * Emits a debug message
     * @param message
     */
    private debug(message: string) {
        this.manager.emit(RESTEvents.Debug, `[REST] ${message}`);
    }

    /**
     * Delay all requests for the specified amount of time, handling global rate limits
     * @param time
     */
    private async globalDelayFor(time: number): Promise<void> {
        await sleep(time, undefined, { ref: false });
        this.manager.delay = null;
    }

    /**
     * Determines whether the request should be queued or whether a RateLimitError should be thrown
     */
    private async onRateLimit(rateLimitData: RateLimitData) {
        const { options } = this.manager;
        if (!options.rejectOnRateLimit) return;

        const shouldThrow =
            typeof options.rejectOnRateLimit === 'function'
                ? await options.rejectOnRateLimit(rateLimitData)
                : options.rejectOnRateLimit.some((route: string) => rateLimitData.route.startsWith(route.toLowerCase()));
        if (shouldThrow) {
            throw new RateLimitError(rateLimitData);
        }
    }

    /**
     * {@inheritDoc IHandler.queueRequest}
     */
    public async queueRequest(
        routeId: RouteData,
        url: string,
        options: RequestOptions,
        requestData: HandlerRequestData,
    ): Promise<Dispatcher.ResponseData> {
        const queue = this.#asyncQueue;

        // Wait for any previous requests to be completed before this one is run
        await queue.wait({ signal: requestData.signal });

        try {
            // Make the request, and return the results
            return await this.runRequest(routeId, url, options, requestData);
        } finally {
            // Allow the next request to fire
            queue.shift();
        }
    }

    /**
     * The method that actually makes the request to the api, and updates info about the bucket accordingly
     * @param routeId - The generalized api route with literal ids for major parameters
     * @param url - The fully resolved url to make the request to
     * @param options - The fetch options needed to make the request
     * @param requestData - Extra data from the user's request needed for errors and additional processing
     * @param retries - The number of retries this request has already attempted (recursion)
     */
    private async runRequest(
        routeId: RouteData,
        url: string,
        options: RequestOptions,
        requestData: HandlerRequestData,
        retries = 0,
    ): Promise<Dispatcher.ResponseData> {
        /**
         * After calculations have been done, pre-emptively stop further requests
         * Potentially loop until this task can run if e.g. the global rate limit is hit twice
         */
        while (this.limited) {
            // Set RateLimitData
            const limit = this.limit;
            const timeout = this.timeToReset;
            const delay = sleep(timeout);

            const rateLimitData: RateLimitData = {
                timeToReset: timeout,
                limit,
                method: options.method ?? 'get',
                url,
                route: routeId.bucketRoute,
            };
            // Let library users know they have hit a rate limit
            this.manager.emit(RESTEvents.RateLimited, rateLimitData);
            // Determine whether a RateLimitError should be thrown
            await this.onRateLimit(rateLimitData);
            // When not erroring, emit debug for what is happening
            this.debug(`Waiting ${timeout}ms for rate limit to pass`);

            // Wait the remaining time left before the rate limit resets
            await delay;
        }

        // As the request goes out, update the global usage information
        if (!this.manager.reset || this.manager.reset < Date.now()) {
            this.manager.reset = Date.now() + 1_000;
            this.manager.remaining = this.manager.options.requestsPerSecond;
        }

        this.manager.remaining--;

        const method = options.method ?? 'get';

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.manager.options.timeout).unref();
        if (requestData.signal) {
            // The type polyfill is required because Node.js's types are incomplete
            const signal = requestData.signal as PolyFillAbortSignal;
            // If the user signal was aborted, abort the controller, else abort the local signal.
            // The reason why we don't re-use the user's signal, is because users may use the same signal for multiple
            // requests, and we do not want to cause unexpected side effects.
            if (signal.aborted) controller.abort();
            else signal.addEventListener('abort', () => controller.abort());
        }

        let res: Dispatcher.ResponseData;
        try {
            res = await request(url, { ...options, signal: controller.signal });
        } catch (error: unknown) {
            // Retry the specified number of times for possible timed out requests
            if (error instanceof Error && error.name === 'AbortError' && retries !== this.manager.options.retries) {
                return await this.runRequest(routeId, url, options, requestData, ++retries);
            }

            throw error;
        } finally {
            clearTimeout(timeout);
        }

        if (this.manager.listenerCount(RESTEvents.Response)) {
            this.manager.emit(
                RESTEvents.Response,
                {
                    method,
                    path: routeId.original,
                    route: routeId.bucketRoute,
                    options,
                    data: requestData,
                    retries,
                },
                { ...res },
            );
        }

        const status = res.statusCode;

        const limit = parseHeader(res.headers['x-ratelimit-limit']);
        const remaining = parseHeader(res.headers['x-ratelimit-remaining']);
        const reset = parseHeader((res.headers['x-ratelimit-reset']));

        // Update the total number of requests that can be made before the rate limit resets
        this.limit = limit ? Number(limit) : Number.POSITIVE_INFINITY;
        // Update the number of remaining requests that can be made before the rate limit resets
        this.remaining = remaining ? Number(remaining) : 1;
        // Update the time when this rate limit resets (reset-after is in seconds)
        this.reset = reset ? Number(reset) * 1_000 + Date.now() + this.manager.options.offset : Date.now();

        // Count the invalid requests
        if (status === 401 || status === 403 || status === 429) {
            if (!invalidCountResetTime || invalidCountResetTime < Date.now()) {
                invalidCountResetTime = Date.now() + 1_000 * 60 * 10;
                invalidCount = 0;
            }

            invalidCount++;

            const emitInvalid = this.manager.options.invalidRequestWarningInterval > 0 && invalidCount % this.manager.options.invalidRequestWarningInterval === 0;
            if (emitInvalid) {
                // Let library users know periodically about invalid requests
                this.manager.emit(RESTEvents.InvalidRequestWarning, {
                    count: invalidCount,
                    remainingTime: invalidCountResetTime - Date.now(),
                });
            }
        }

        if (status >= 200 && status < 300) {
            return res;
        } else if (status === 429) {
            // A rate limit was hit - this may happen when first rate limited
            // Set RateLimitData based on the global limit
            const limit = this.limit;
            const timeout = this.timeToReset;

            await this.onRateLimit({
                timeToReset: timeout,
                limit,
                method,
                url,
                route: routeId.bucketRoute,
            });
            this.debug(
                [
                    'Encountered unexpected 429 rate limit',
                    `Method         : ${method}`,
                    `URL            : ${url}`,
                    `Bucket         : ${routeId.bucketRoute}`,
                    `Major parameter: ${routeId.majorParameter}`,
                    `Limit          : ${limit}`,
                ].join('\n'),
            );

            // Since this is not a server side issue, the next request should pass, so we don't bump the retries counter
            return this.runRequest(routeId, url, options, requestData, retries);
        } else if (status >= 500 && status < 600) {
            // Retry the specified number of times for possible server side issues
            if (retries !== this.manager.options.retries) {
                return this.runRequest(routeId, url, options, requestData, ++retries);
            }

            // We are out of retries, throw an Error
            throw new HTTPError(res.constructor.name, status, method, url, requestData);
        } else {
            // Handle possible malformed requests
            if (status >= 400 && status < 500) {
                // If we receive this status code, it means the token we had is no longer valid
                if (status === 401 && requestData.auth) {
                    this.manager.setToken(null!);
                }

                // The request will not succeed for some reason, parse the error returned from the api
                const data = (await parseResponse(res)) as ModrinthErrorData | OAuthErrorData;
                // throw the API error
                throw new ModrinthAPIError(data, 'code' in data ? data.code : data.error, status, method, url, requestData);
            }

            return res;
        }
    }
}

interface PolyFillAbortSignal {
    readonly aborted: boolean;
    addEventListener(type: 'abort', listener: () => void): void;
    removeEventListener(type: 'abort', listener: () => void): void;
}
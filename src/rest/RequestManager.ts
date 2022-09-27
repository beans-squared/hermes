import { Blob, Buffer } from 'node:buffer';
import { EventEmitter } from 'node:events';
import { setInterval, clearInterval } from 'node:timers';
import type { URLSearchParams } from 'node:url';
import { FormData, type RequestInit, type BodyInit, type Dispatcher, type Agent } from 'undici';
import type { RESTOptions, RestEvents, RequestOptions }  from './REST.js';
import type { IHandler } from './handlers/IHandler.js';
import { SequentialHandler } from './handlers/SequentialHandler.js';
import { DefaultRestOptions, RESTEvents } from './utils/constants.js';
import { resolveBody } from './utils/utils.js';

/**
 * Represents a file to be added to the request
 */
export interface RawFile {
    /**
     * Content-Type of the file
     */
    contentType?: string;
    /**
     * The actual data for the file
     */
    data: Buffer | boolean | number | string;
    /**
     * An explicit key to use for key of the formdata field for this file.
     * When not provided, the index of the file in the files array is used in the form 'files[${index}]'.
     * If you wish to alter the placeholder snowflake, you must provide this property in the same form ('files[${placeholder}]')
     */
    key?: string;
    /**
     * The name of the file
     */
    name: string;
}

/**
 * Represents possible data to be given to an endpoint
 */
export interface RequestData {
    /**
     * If this request requires the 'Authorization' header
     */
    auth?: boolean;
    /**
     * The body to send with this request
     */
    body?: unknown;
    /**
     * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} to use for this request
     */
    dispatcher?: Agent;
    /**
     * Files to be attached to this request
     */
    files?: RawFile[] | undefined;
    /**
     * Additional headers to add to this request
     */
    headers?: Record<string, string>;
    /**
     * Whether to pass through the body property directly to 'fetch()'.
     * <warn>This only applies when files are NOT present</warn>
     */
    passThroughBody?: boolean;
    /**
     * Query string parameters to append to the called endpoint
     */
    query?: URLSearchParams;
    /**
     * The signal to abort the queue entry or REST call, where applicable
     */
    signal?: AbortSignal | undefined;
    /**
     * If this request should be versioned
     * @default true
     */
    versioned?: boolean;
}

/**
 * Possible headers for an API call
 */
export interface RequestHeaders {
    Authorization?: string;
    'User-Agent': string;
}

/**
 * Possible API methods to be used when doing requests
 */
export const enum RequestMethod {
    Delete = 'DELETE',
    Get = 'GET',
    Patch = 'PATCH',
    Post = 'POST',
}

export type RouteLike = `/${string}`;

/**
 * Internal request options
 * @internal
 */
export interface InternalRequest extends RequestData {
    fullRoute: RouteLike;
    method: RequestMethod;
}

export type HandlerRequestData = Pick<InternalRequest, 'auth' | 'body' | 'files' | 'signal'>;

/**
 * Parsed route data for an endpoint
 * @internal
 */
export interface RouteData {
    bucketRoute: string;
    majorParameter: string;
    original: RouteLike;
}

export interface RequestManager {
    emit: (<K extends keyof RestEvents>(event: K, ...args: RestEvents[K]) => boolean) &
        (<S extends string | symbol>(events: Exclude<S, keyof RestEvents>, ...args: any[]) => boolean);

    off: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
        (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

    on: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
        (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

    once: (<K extends keyof RestEvents>(event: K, listener: (...args: RestEvents[K]) => void) => this) &
        (<S extends string | symbol>(event: Exclude<S, keyof RestEvents>, listener: (...args: any[]) => void) => this);

    removeAllListeners: (<K extends keyof RestEvents>(event?: K) => this) &
        (<S extends string | symbol>(event?: Exclude<S, keyof RestEvents>) => this);
}

/**
 * The class that managers handlers for all endpoints
 */
export class RequestManager extends EventEmitter {
    /**
     * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} for all requests performed by this manager
     */
    public agent: Dispatcher | null = null;
    /**
     * The number of requests remaining
     */
    public remaining: number;
    /**
     * The promise used to wait out the rate limit
     */
    public delay: Promise<void> | null = null;
    /**
     * The timestamp at which the rate limit resets
     */
    public reset = -1;

    public readonly handler: SequentialHandler;

    #token: string | null = null;

    public readonly options: RESTOptions;

    public constructor(options: Partial<RESTOptions>) {
        super();
        this.options = { ...DefaultRestOptions, ...options };
        this.options.offset = Math.max(0, this.options.offset);
        this.remaining = this.options.requestsPerSecond;
        this.agent = options.agent ?? null;
        this.handler = new SequentialHandler(this);
    }

    /**
     * Sets the default agent to use for requests performed by this manager
     * @param agent - The agent to use
     */
    public setAgent(agent: Dispatcher) {
        this.agent = agent;
        return this;
    }

    public setToken(token: string) {
        this.#token = token;
        return this;
    }

    /**
     * Queues a request to be sent
     * @param request - All the information needed to make a request
     * @returns The response from the API request
     */
    public async queueRequest(request: InternalRequest): Promise<Dispatcher.ResponseData> {
        // Generalize the endpoint to its route data
        const routeId = RequestManager.generateRouteData(request.fullRoute, request.method);

        // Resolve the request into usable fetch options
        const { url, fetchOptions } = await this.resolveRequest(request);

        // Queue the request
        return this.handler.queueRequest(routeId, url, fetchOptions, {
            body: request.body,
            files: request.files,
            auth: request.auth !== false,
            signal: request.signal,
        });
    }

    private async resolveRequest(request: InternalRequest): Promise<{ fetchOptions: RequestOptions; url: string }> {
        const { options } = this;

        let query = '';

        // If a query option is passed, use it
        if (request.query) {
            const resolvedQuery = request.query.toString();
            if (resolvedQuery !== '') {
                query = `?${resolvedQuery}`;
            }
        }

        // Create the required headers
        const headers: RequestHeaders = {
            ...this.options.headers,
            'User-Agent': `${options.userAgent}`.trim(),
        };

        // If this request requires authorization
        if (request.auth !== false) {
            // If we haven't received a token, throw an error
            if (!this.#token) {
                throw new Error('Expected token to be set for this request, but none was present');
            }

            headers.Authorization = `${this.#token}`;
        }

        // Format the full request URL (api base, optional version, endpoint, optional querystring)
        const url = `${options.api}${request.versioned === false ? '' : `/v${options.version}`}${request.fullRoute}${query}`;

        let finalBody: RequestInit['body'];
        let additionalHeaders: Record<string, string>;

        if (request.files?.length) {
            // stuff
        } else if (request.body != null) {
            if (request.passThroughBody) {
                finalBody = request.body as BodyInit;
            } else {
                // Stringify the JSON data
                finalBody = JSON.stringify(request.body);
                // Set the additional headers to specify the content-type
                additionalHeaders = { 'Content-Type': 'application/json' };
            }
        }

        finalBody = await resolveBody(finalBody);

        const fetchOptions: RequestOptions = {
            headers: { ...request.headers, ...headers } as Record<string, string>,
            method: request.method.toUpperCase() as Dispatcher.HttpMethod,
        };

        if (finalBody !== undefined) {
            fetchOptions.body = finalBody as Exclude<RequestOptions['body'], undefined>;
        }

        // Prioritize setting an agent per request, use the agent for this instance otherwise
        fetchOptions.dispatcher = request.dispatcher ?? this.agent ?? undefined;

        return { url, fetchOptions };
    }

    private static generateRouteData(endpoint: RouteLike, method: RequestMethod): RouteData {
        const majorIdMatch = /^\/(?:channels|guilds|webhooks)\/(\d{16,19})/.exec(endpoint); // change

        // Get the major id for this route - global otherwise
        const majorId = majorIdMatch?.[1] ?? 'global';

        const baseRoute = endpoint
            // Strip out all ids
            .replace(/\/d{16,19}/g, ':id');

        return {
            majorParameter: majorId,
            bucketRoute: baseRoute,
            original: endpoint,
        };
    }
}
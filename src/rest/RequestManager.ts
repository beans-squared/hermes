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
     * Additional headers to add to this request
     */
    headers?: Record<string, string>;
    /**
     * Query string parameters to append to the called endpoint
     */
    query?: URLSearchParams;
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

export const enum RequestMethod {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Delete = 'DELETE',
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

/**
 * The class that managers handlers for all endpoints
 */
export class RequestManager {
    /**
     * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} for all requests performed by this manager
     */
    public agent: Dispatcher | null = null;
    /**
     * The promise used to wait out the global rate limit
     */
    public globalDelay: Promise<void> | null = null;
    /**
     * The timestamp at which the global bucket resets
     */
    public globalReset = -1;

    #token: string | null = null;

    public readonly options: RESTOptions;

    public constructor(options: Partial<RESTOptions>) {
        this.options = { ...DefaultRestOptions, ...options };
        this.agent = options.agent ?? null;
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
        return handler.queueRequest(routeId, url, fetchOptions, {
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
            headers: { ...request.headers, ...additionalHeaders, ...headers } as Record<string, string>,
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
import { type Agent, type Dispatcher } from 'undici';
import type { RESTOptions } from './REST.js';
import { DefaultRestOptions } from "./utils/constants.js";

/**
 * The class that managers handlers for all endpoints
 */
export class RequestManager {
    /**
     * The {@link https://undici.nodejs.org/#/docs/api/Agent Agent} for all requests performed by this manager
     */
    public agent: Dispatcher | null = null;

    private token: string | null = null;

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
        this.token = token;
        return this;
    }
}

export const enum RequestMethod {
    Get = 'GET',
    Post = 'POST',
    Patch = 'PATCH',
    Delete = 'DELETE',
}

export type RouteLike = `/${string}`;

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

/**
 * Internal request options
 * @internal
 */
export interface InternalRequest extends RequestData {
    fullRoute: RouteLike;
    method: RequestMethod;
}

import {InternalRequest, RequestData, RequestManager, RequestMethod, RouteLike} from "./RequestManager.js";
import { Dispatcher } from "undici";
import { parseResponse } from "./utils/utils.js";

/**
 * Options to be passed when creating a REST instance
 */
export interface RESTOptions{
    /**
     * The agent to set globally
     */
    agent: Dispatcher;

    /**
     * The base API origin URL, excluding version
     * @default https://api.modrinth.com/
     */
    api: string;

    /**
     * The number of retries for 5xx error codes returned, or requests that timeout
     * @default 3
     */
    retries: number;

    /**
     * The time to wait in milliseconds before a request is aborted
     * @default 30_000
     */
    timeout: number;

    /**
     * The user agent to use for all requests
     * @default big7star/labrinthjs/${VERSION}
     */
    userAgent: string,

    /**
     * The version of the API to use
     * @default 2
     */
    version: string;
}

export class REST {
    public readonly requestManager: RequestManager;

    public constructor(options: Partial<RESTOptions> = {}) {
        this.requestManager = new RequestManager(options);
    }

    /**
     * Gets the agent set for this instance
     */
    public getAgent() {
        return this.requestManager.agent;
    }

    /**
     * Sets the default agent to use for requests performed by this instance
     * @param agent - The agent to use
     */
    public setAgent(agent: Dispatcher) {
        this.requestManager.setAgent(agent);
        return this;
    }

    /**
     * Sets the authorization token to be used for all requests
     * @param token - The authorization token to use
     * @returns This REST instance
     */
    public setToken(token: string): this {
        this.requestManager.setToken(token);
        return this;
    }

    /**
     * Runs a GET request to Modrinth
     */
    public async get(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, fullRoute, method: RequestMethod.Get });
    }

    /**
     * Runs a POST request to Modrinth
     */
    public async post(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, fullRoute, method: RequestMethod.Post });
    }

    /**
     * Runs a PATCH request to Modrinth
     */
    public async patch(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, fullRoute, method: RequestMethod.Patch });
    }

    /**
     * Runs a DELETE request to Modrinth
     */
    public async delete(fullRoute: RouteLike, options: RequestData = {}) {
        return this.request({ ...options, fullRoute, method: RequestMethod.Delete });
    }

    /**
     * Runs a request to Modrinth
     * @param options - Request options
     */
    public async request(options: InternalRequest) {
        const response = await this.raw(options);
        return parseResponse(response);
    }

    /**
     * Runs a request to Modrinth; returns the raw response object
     * @param options
     */
    public async raw(options: InternalRequest) {
        return this.requestManager.queueRequest(options);
    }
}


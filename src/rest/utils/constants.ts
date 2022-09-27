import { RESTOptions } from '../REST.js';
import { getGlobalDispatcher } from 'undici';
import { VERSION } from "../../version.js";

export const DefaultRestOptions: Required<RESTOptions> = {
    get agent() {
        return getGlobalDispatcher();
    },
    api: 'https://api.modrinth.com/',
    headers: {},
    invalidRequestWarningInterval: 0,
    offset: 50,
    rejectOnRateLimit: null,
    requestsPerSecond: 50,
    retries: 3,
    timeout: 15_000,
    userAgent: `labrinthjs/${VERSION}`,
    version: '2',
}

/**
 * The events that the REST manager emits
 */
export const enum RESTEvents {
    Debug = 'restDebug',
    InvalidRequestWarning = 'invalidRequestWarning',
    RateLimited = 'rateLimited',
    Response = 'response',
}
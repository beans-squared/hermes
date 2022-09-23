import { RESTOptions } from '../REST.js';
import { getGlobalDispatcher } from 'undici';
import { VERSION } from "../../version.js";

export const DefaultRestOptions: Required<RESTOptions> = {
    get agent() {
        return getGlobalDispatcher();
    },
    api: 'https://api.modrinth.com/',
    retries: 3,
    timeout: 30_000,
    userAgent: `big7star/labrinthjs/${VERSION}`,
    version: '2',
}
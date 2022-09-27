import { ClientOptions } from '../util/Options.js';
import { REST } from '../rest/REST.js';

/**
 * The main starting point for any application interacting with the Modrinth API
 */
export default class Client {
    public constructor(options: ClientOptions) {
        public options: options
        private rest: new REST(options.rest)
    }
}
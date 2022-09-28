import { REST } from '../rest/REST.js';

interface ClientOptions {

}

const DefaultClientOptions: Required<ClientOptions> = {

}

/**
 * The main starting point for any application interacting with the Modrinth API.
 */
export class Client {
    public readonly options: ClientOptions;
    private rest: REST;

    public constructor(options: Partial<ClientOptions>) {
        this.options = { ...DefaultClientOptions, ...options };
        this.rest = new REST();
    }
}
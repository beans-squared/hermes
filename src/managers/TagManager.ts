import type { Client } from '../client/Client.js';

export class TagManager {
    public readonly client: Client;

    public constructor(client: Client) {
        this.client = client;
    }
}
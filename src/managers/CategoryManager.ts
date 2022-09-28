import type { Category } from '../structures/Category.js';
import { TagManager } from './TagManager.js';
import { Client } from '../client/Client.js';

export class CategoryManager extends TagManager {
    public readonly cache: Map<string, Category>

    public constructor(client: Client) {
        super(client);
    }
}
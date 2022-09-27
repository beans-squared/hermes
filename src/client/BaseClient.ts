import { EventEmitter } from 'node:events';

/**
 * The base class for all clients.
 */
export class BaseClient extends EventEmitter {
    constructor(options = {}) {
        super({ captureRejections: true });
    }
}
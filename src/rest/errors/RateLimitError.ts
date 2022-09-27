import type { RateLimitData } from '../REST.js';

export class RateLimitError extends Error implements RateLimitData {
    public timeToReset: number;
    public limit: number;
    public method: string;
    public url: string;
    public route: string;
    public majorParameter: string;
    public global: boolean;

    public constructor({ timeToReset, limit, method, url, route, majorParameter, global }: RateLimitData) {
        super();
        this.timeToReset = timeToReset;
        this.limit = limit;
        this.method = method;
        this.url = url;
        this.route = route;
        this.majorParameter = majorParameter;
        this.global = global;
    }

    /**
     * The name of error
     */
    public override get name(): string {
        return `${RateLimitError.name}[${this.route}]`;
    }
}
interface APILicense {
    short: string;
    name: string;
}

export class License {
    public readonly data: APILicense;

    public constructor(data: APILicense) {
        this.data = { ...data };
    }

    /**
     * The short identifier of this license.
     */
    public get short(): string {
        return this.data.short;
    }

    /**
     * The full name of this license.
     */
    public get name(): string {
        return this.data.name;
    }
}
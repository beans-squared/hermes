interface APIDonationPlatform {
    short: string;
    name: string;
}

export class DonationPlatform {
    public readonly data: APIDonationPlatform;

    public constructor(data: APIDonationPlatform) {
        this.data = { ...data };
    }

    /**
     * The short identifier for this donation platform.
     */
    public get short(): string {
        return this.data.short;
    }

    /**
     * The full name of this donation platform.
     */
    public get name(): string {
        return this.data.short;
    }
}
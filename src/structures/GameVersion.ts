interface APIGameVersion {
    version: string;
    versionType: GameVersionType;
    date: string;
    major: boolean;
}

export class GameVersion {
    public readonly data: APIGameVersion;

    public constructor(data: APIGameVersion) {
        this.data = { ...data };
    }

    /**
     * The name/number of this game version.
     */
    public get version(): string {
        return this.data.version;
    }

    /**
     * The type of this game version.
     */
    public get versionType(): GameVersionType {
        return this.data.versionType;
    }

    /**
     * The date of this game version's release.
     */
    public get date(): string {
        return this.data.date;
    }

    /**
     * Whether this is a major version; used for featured versions.
     */
    public get major(): boolean {
        return this.data.major;
    }
}
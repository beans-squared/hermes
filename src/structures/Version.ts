type VersionType = 'release' | 'beta' | 'alpha';
type DependencyType = 'required' | 'optional' | 'incompatible' | 'unknown';

interface VersionDependency {
    versionId: string | null;
    projectId: string | null;
    fileName: string | null;
    dependencyType: DependencyType;
}

interface VersionFileHash {
    sha512: string;
    sha1: string;
}

interface VersionFile {
    hashes: Array<VersionFileHash>;
    url: string;
    filename: string;
    primary: boolean;
    size: number;
}

interface APIVersion {
    name: string;
    versionNumber: string;
    changelog: string | null;
    dependencies: Array<VersionDependency> | null;
    gameVersions: Array<string>;
    versionType: VersionType;
    loaders: Array<string>;
    featured: boolean;
    id: string;
    projectId: string;
    authorId: string;
    datePublished: string;
    downloads: number;
    files: Array<VersionFile>;
}

export class Version {
    public readonly data: APIVersion;

    public constructor(data: APIVersion) {
        this.data = { ...data };
    }

    /**
     * The name of this version.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * The version number. Ideally will follow semantic versioning.
     */
    public get versionNumber(): string {
        return this.data.versionNumber;
    }

    /**
     * The changelog for this version, if one is present.
     */
    public get changelog(): string | null {
        return this.data.changelog ?? null;
    }

    /**
     * A list of specific versions of projects that this version depends on, if any.
     */
    public get dependencies(): Array<VersionDependency> | null {
        return this.data.dependencies ?? null;
    }

    /**
     * A list of versions of Minecraft that this version supports.
     */
    public get gameVersions(): Array<string> {
        return this.data.gameVersions;
    }

    /**
     * The release channel for this version.
     */
    public get versionType(): VersionType {
        return this.data.versionType;
    }

    /**
     * The mod loaders that this version supports.
     */
    public get loaders(): Array<string> {
        return this.data.loaders;
    }

    /**
     * Whether this version is featured or not.
     */
    public get featured(): boolean {
        return this.data.featured;
    }

    /**
     * The ID of this version, encoded as a base62 string.
     */
    public get id(): string {
        return this.data.id;
    }

    /**
     * The ID of the project this version is for.
     */
    public get projectId(): string {
        return this.data.projectId;
    }

    /**
     * The ID of the user who published this version.
     */
    public get authorId(): string {
        return this.data.authorId;
    }

    /**
     * The date this version was published, formatted as a ISO-8601 string.
     */
    public get datePublished(): string {
        return this.data.datePublished;
    }

    /**
     * The number of times this version has been downloaded.
     */
    public get downloads(): number {
        return this.data.downloads;
    }

    /**
     * A list of files available for download for this version.
     */
    public get files(): Array<VersionFile> {
        return this.data.files;
    }
}
type VersionType = 'release' | 'beta' | 'alpha';

interface APIVersion {
    name: string;
    versionNumber: string;
    changelog: string | null;
    dependencies: Array<Object> | null;
    gameVersions: Array<string>;
    versionType: VersionType;
    loaders: Array<string>;
    featured: boolean;
    id: string;
    projectId: string;
    authorId: string;
    datePublished: string;
    downloads: number;
    files: Array<Object>;
}

export class Version {
    public readonly data: APIVersion;

    public constructor(data: APIVersion) {
        this.data = { ...data };
    }

    public get name(): string {
        return this.data.name;
    }

    public get versionNumber(): string {
        return this.data.versionNumber;
    }

    public get changelog(): string | null {
        return this.data.changelog ?? null;
    }

    public get dependencies(): Array<ProjectDependency> {
        return this.data.dependencies ?? null;
    }

    public get gameVersions(): Array<string> {
        return this.data.gameVersions;
    }

    public get versionType(): VersionType {
        return this.data.versionType;
    }

    public get loaders(): Array<string> {
        return this.data.loaders;
    }

    public get featured(): boolean {
        return this.data.featured;
    }

    public get id(): string {
        return this.data.id;
    }

    public get projectId(): string {
        return this.data.projectId;
    }

    public get authorId(): string {
        return this.data.authorId;
    }

    public get datePublished(): string {
        return this.data.datePublished;
    }

    public get downloads(): number {
        return this.data.downloads;
    }

    public get files(): Array<VersionFile> {
        return this.data.files;
    }
}
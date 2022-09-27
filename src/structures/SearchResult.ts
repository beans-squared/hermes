type SideSupportType = 'required' | 'optional' | 'unsupported';

type ProjectType = 'mod' | 'modpack' | 'resourcepack';

interface APISearchResult {
    slug: string;
    title: string;
    description: string;
    categories: Array<string>;
    clientSide: SideSupportType;
    serverSide: SideSupportType;
    projectType: ProjectType;
    downloads: number;
    iconUrl: string | null;
    projectId: string;
    author: string;
    displayCategories: Array<string>;
    versions: Array<string>;
    follows: number;
    dateCreated: string;
    dateModified: string;
    latestVersion: string;
    license: string;
    gallery: Array<string>;
}

export class SearchResult {
    public readonly data: APISearchResult;

    public constructor(data: APISearchResult) {
        this.data = { ...data };
    }

    /**
     * The slug of this project, used for vanity URLs.
     */
    public get slug(): string {
        return this.data.slug;
    }

    /**
     * The title or name of this project.
     */
    public get title(): string {
        return this.data.title;
    }

    /**
     * The short description of this project.
     */
    public get description(): string {
        return this.data.description;
    }

    /**
     * The list of categories this project is under.
     */
    public get categories(): Array<string> {
        return this.data.categories;
    }

    /**
     * The client-side support type of this project.
     */
    public get clientSide(): SideSupportType {
        return this.data.clientSide;
    }

    /**
     * The server-side support type of this project.
     */
    public get serverSide(): SideSupportType {
        return this.data.serverSide;
    }

    /**
     * The project type of this project.
     */
    public get projectType(): ProjectType {
        return this.data.projectType;
    }

    /**
     * The total number of downloads of this project.
     */
    public get downloads(): number {
        return this.data.downloads;
    }

    /**
     * The URL of this project's icon.
     */
    public get iconUrl(): string | null {
        return this.data.iconUrl ?? null;
    }

    /**
     * The ID of this project.
     */
    public get projectId(): string {
        return this.data.projectId;
    }

    /**
     * The username of this project's author.
     */
    public get author(): string {
        return this.data.author;
    }

    /**
     * The list of categories this project is under that are not secondary.
     */
    public get displayCategories(): Array<string> {
        return this.data.displayCategories;
    }

    /**
     * The list of Minecraft versions supported by the project.
     */
    public get versions(): Array<string> {
        return this.data.versions;
    }

    /**
     * The total number of users following this project.
     */
    public get follows(): number {
        return this.data.follows;
    }

    /**
     * The date this project was added to search.
     */
    public get dateCreated(): string {
        return this.data.dateCreated;
    }

    /**
     * The date this project was last modified.
     */
    public get dateModified(): string {
        return this.data.dateModified;
    }

    /**
     * The latest version of Minecraft that this project supports.
     */
    public get latestVersion(): string {
        return this.data.latestVersion;
    }

    /**
     * The license of this project.
     */
    public get license(): string {
        return this.data.license;
    }

    /**
     * The list of gallery images attached to this project.
     */
    public get gallery(): Array<string> {
        return this.data.gallery;
    }
}

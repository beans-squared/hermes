interface APIProject {
    slug: string;
    title: string;
    description: string;
    categories: Array<string>;
    clientSide: SideSupportType;
    serverSide: SideSupportType;
    body: string;
    additionalCategories: Array<string>;
    issuesUrl: string | null;
    sourceUrl: string | null;
    wikiUrl: string | null;
    discordUrl: string | null;
    donationUrls: Array<Object> | null;
    projectType: ProjectType;
    downloads: number;
    iconUrl: string;
    id: string;
    team: string;
    moderatorMessage: ModeratorMessage | null;
    published: string;
    updated: string;
    approved: string | null;
    followers: number;
    status: ProjectStatus;
    license: License;
    versions: Array<string>;
    gallery: Array<Object> | null;
}

export class Project {
    public readonly data: APIProject;

    public constructor(data: APIProject) {
        this.data = {...data};
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
     * The long form description of this project.
     */
    public get body(): string {
        return this.data.body;
    }

    /**
     * The list of categories this project is under which are searchable but non-primary.
     */
    public get additionalCategories(): Array<Array> {
        return this.data.additionalCategories;
    }

    /**
     * The link to where to submit bugs or issues with this project, if there is one.
     */
    public get issuesUrl(): string | null {
        return this.data.issuesUrl ?? null;
    }

    /**
     * The link to the source code of this project, if there is one.
     */
    public get sourceUrl(): string | null {
        return this.data.sourceUrl ?? null;
    }

    /**
     * The link to this project's wiki, documentation or other relevant information, if there is one.
     */
    public get wikiUrl(): string | null {
        return this.data.wikiUrl ?? null;
    }

    /**
     * The link to this project's Discord server, if there is one.
     */
    public get discordUrl(): string | null {
        return this.data.discordUrl ?? null;
    }

    /**
     * The list of donation links for this project, if any.
     */
    public get donationUrls(): Array<string> | null {
        return this.data.donationUrls ?? null;
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
     * The URL of this project's icon, if there is one.
     */
    public get iconUrl(): string | null {
        return this.data.iconUrl ?? null;
    }

    /**
     * The ID of this project, encoded as a base62 string.
     */
    public get id(): string {
        return this.data.id;
    }

    /**
     * The ID of the team that has ownership of this project.
     */
    public get team(): string {
        return this.data.team;
    }

    /**
     * The message that a moderator has left regarding the project, if there is one.
     */
    public get moderatorMessage(): ModeratorMessage {
        return this.data.moderatorMessage;
    }

    /**
     * The date this project was published.
     */
    public get published(): string {
        return this.data.published;
    }

    /**
     * The date this project was lasted updated.
     */
    public get updated(): string {
        return this.data.updated;
    }

    /**
     * The date this project's status was set as approved or unlisted, if applicable.
     */
    public get approved(): string {
        return this.data.updated;
    }

    /**
     * The total number of users following this project.
     */
    public get followers(): number {
        return this.data.followers;
    }

    /**
     * The status of this project.
     */
    public get status(): ProjectStauts {
        return this.data.status;
    }

    /**
     * The license of this project.
     */
    public get license(): License {
        return this.data.license;
    }

    /**
     * The list of version IDs listed under this project (will never be empty unless the project is in draft status).
     */
    public get versions(): Array<string> {
        return this.data.versions;
    }

    /**
     * The list of images that have been uploaded to this project's gallery.
     */
    public get gallery(): Array<Object> | null {
        return this.data.gallery ?? null;
    }
}
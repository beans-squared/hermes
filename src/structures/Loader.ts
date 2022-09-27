interface APILoader {
    icon: string;
    name: string;
    supportedProjectTypes: string;
}

export class Loader {
    public readonly data: APILoader;

    public constructor(data: APILoader) {
        this.data = { ...data };
    }

    /**
     * The SVG icon of this loader.
     */
    public get icon(): string {
        return this.data.icon;
    }

    /**
     * The name of this loader.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * The project types this loader is applicable to.
     */
    public get supportedProjectTypes(): string {
        return this.data.supportedProjectTypes;
    }
}
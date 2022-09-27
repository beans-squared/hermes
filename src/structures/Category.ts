interface APICategory {
    icon: string;
    name: string;
    projectType: string;
    header: string;
}

export class Category {
    public readonly data: APICategory;

    public constructor(data: APICategory) {
        this.data = { ...data };
    }

    /**
     * The SVG icon of this category.
     */
    public get icon(): string {
        return this.data.icon;
    }

    /**
     * The name of this category.
     */
    public get name(): string {
        return this.data.name;
    }

    /**
     * The project type this category is applicable to.
     */
    public get projectType(): string {
        return this.data.projectType;
    }

    /**
     * The header under which this category should go.
     */
    public get header(): string {
        return this.data.header;
    }
}

type UserRole = 'admin' | 'moderator' | 'developer';

interface APIUser {
    username: string;
    name: string | null;
    email: string | null;
    bio: string;
    id: string;
    githubId: number | null;
    avatarUrl: string;
    created: string;
    role: UserRole;
}

/**
 * Represents a user on Modrinth.
 */
export class User {
    public readonly data: APIUser;

    public constructor(data: APIUser) {
        this.data = { ...data };
    }

    /**
     * The user's username.
     */
    public get username(): string {
        return this.data.username;
    }

    /**
     * The user's display name, if they have one.
     */
    public get name(): string | null {
        return this.data.name ?? null;
    }

    /**
     * The user's email (only your own is ever displayed).
     */
    public get email(): string | null {
        return this.data.email ?? null;
    }

    /**
     * The user's bio, if they have one.
     */
    public get bio(): string| null {
        return this.data.bio ?? null;
    }

    /**
     * The user's ID.
     */
    public get id(): string {
        return this.data.id;
    }

    /**
     * The user's GitHub ID number, if they have one.
     */
    public get githubId(): number | null {
        return this.data.githubId ?? null;
    }

    /**
     * The URL link to the user's avatar.
     */
    public get avatarUrl(): string {
        return this.data.avatarUrl;
    }

    /**
     * The timestamp at which the user was created.
     */
    public get created(): string {
        return this.data.created;
    }

    /**
     * The user's role on Modrinth.
     */
    public get role(): UserRole {
        return this.data.role;
    }
}
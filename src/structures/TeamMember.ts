import type { User } from './User.js';

interface APITeamMember {
    teamId: string;
    user: User;
    role: string;
    permissions: number;
    accepted: boolean;
}


/**
 * Represents a user that is a member of a team.
 */
export class TeamMember {
    /**
     * The API team member data.
     */
    public readonly data: APITeamMember;

    public constructor(data: APITeamMember) {
        this.data = { ...data };
    }

    /**
     * The ID of the team this user is a member of.
     */
    public get teamId(): string {
        return this.data.teamId;
    }

    /**
     * The actual user object.
     */
    public get user(): User {
        return this.data.user;
    }

    /**
     * The user's role on the team.
     */
    public get role(): string {
        return this.data.role;
    }

    /**
     * The user's permissions in bitfield format (requires authorization to view).
     */
    public get permissions(): number {
        return this.data.permissions ?? null;
    }

    /**
     * Whether the user has accepted to be on the team (requires authorization to view).
     */
    public get accepted(): boolean {
        return this.data.accepted;
    }
}
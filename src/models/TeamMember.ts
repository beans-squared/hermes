export default class TeamMember {
  constructor(
    public readonly team_id: string,
    public readonly user: User,
    public readonly role: string,
    public readonly permissions: number,
    public readonly accepted: boolean
  ) {}
}

type User = {
  username: string;
  name: string | null;
  email: string | null;
  bio: string;
  id: string;
  github_id: number | null;
  avatar_url: string;
  created: string;
  role: "admin" | "moderator" | "developer";
};

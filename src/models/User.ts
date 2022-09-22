export default class User {
  constructor(
    public readonly username: string,
    public readonly name: string | null,
    public readonly email: string | null,
    public readonly bio: string,
    public readonly id: string,
    public readonly github_id: number | null,
    public readonly avatar_url: string,
    public readonly created: string,
    public readonly role: "admin" | "moderator" | "developer"
  ) {}
}

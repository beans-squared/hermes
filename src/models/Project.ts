export default class Project {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly categories: Array<string>,
    public readonly client_side: "required" | "optional" | "unsupported",
    public readonly server_side: "required" | "optional" | "unsupported",
    public readonly body: string,
    public readonly additional_categories: Array<string>,
    public readonly issues_url: string | null,
    public readonly source_url: string | null,
    public readonly wiki_url: string | null,
    public readonly discord_url: string | null,
    public readonly donation_urls: Array<DonationUrl> | null,
    public readonly project_type: "mod" | "modpack" | "resourcepack",
    public readonly downloads: number,
    public readonly icon_url: string | null,
    public readonly id: string,
    public readonly team: string,
    public readonly moderator_message: ModeratorMessage | null,
    public readonly published: string,
    public readonly updated: string,
    public readonly approved: string | null,
    public readonly followers: number,
    public readonly status:
      | "approved"
      | "rejected"
      | "draft"
      | "unlisted"
      | "archived"
      | "processing"
      | "unknown",
    public readonly license: License,
    public readonly versions: Array<string>,
    public readonly gallery: Array<GalleryImage> | null
  ) {}
}

type DonationUrl = {
  id: string;
  platform: string;
  url: string;
};

type ModeratorMessage = {
  message: string;
  body: string | null;
};

type License = {
  id: string;
  name: string;
  url: string | null;
};

type GalleryImage = {
  url: string;
  featured: boolean;
  title: string | null;
  description: string | null;
  created: string;
};

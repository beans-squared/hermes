export default class SearchResult {
  constructor(
    public readonly slug: string,
    public readonly title: string,
    public readonly description: string,
    public readonly categories: Array<string>,
    public readonly client_side: "required" | "optional" | "unsupported",
    public readonly server_side: "required" | "optional" | "unsupported",
    public readonly project_type: string,
    public readonly downloads: number,
    public readonly icon_url: string | null,
    public readonly project_id: string,
    public readonly author: string,
    public readonly display_categories: Array<string>,
    public readonly versions: Array<string>,
    public readonly follows: number,
    public readonly date_created: string,
    public readonly date_modified: string,
    public readonly latest_version: string,
    public readonly license: string,
    public readonly gallery: Array<string>
  ) {}
}

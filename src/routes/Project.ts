import { FormData, request } from "undici";
import { config } from "../config.js";
import toJson from "../helpers/toJson.js";

const baseUrl = config.protocol + config.hostname + config.version;

/**
 * Projects can be mods, plugins, resource packs or modpacks and are created by users.
 */
export default class Project {
  public slug: string = "";
  public title: string = "";
  public description: string = "";
  public categories: Array<string> = [];
  public client_side: "required" | "optional" | "unsupported" = "optional";
  public server_side: "required" | "optional" | "unsupported" = "optional";
  public body: string = "";
  public additional_categories: Array<string> = [];
  public issues_url: string | null = null;
  public source_url: string | null = null;
  public wiki_url: string | null = null;
  public discord_url: string | null = null;
  public donation_urls: Array<DonationUrl> | null = null;
  public project_type: "mod" | "modpack" | "resourcepack" = "mod";
  public downloads: number = 0;
  public icon_url: string | null = null;
  public id: string = "";
  public team: string = "";
  public moderator_message: ModeratorMessage | null = null;
  public published: string = "";
  public updated: string = "";
  public approved: string | null = null;
  public followers: number = 0;
  public status: "approved" | "rejected" | "draft" | "unlisted" | "archived" | "processing" | "unknown" = "unknown";
  public license: License = { id: "", name: "", url: null };
  public versions: Array<string> = [];
  public gallery: Array<GalleryImage> | null = null;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  public setSlug(slug: string) {
    this.slug = slug;
  }

  public setTitle(title: string) {
    this.title = title;
  }

  public setDescription(description: string) {
    this.description = description;
  }

  public setCategories(categories: Array<string>) {
    this.categories = categories;
  }

  public setClientSide(clientSide: "required" | "optional" | "unsupported") {
    this.client_side = clientSide;
  }

  public setServerSide(serverSide: "required" | "optional" | "unsupported") {
    this.server_side = serverSide;
  }

  public setBody(body: string) {
    this.body = body;
  }

  public setAdditionalCategories(additionalCategories: Array<string>) {
    this.additional_categories = additionalCategories;
  }

  public setIssuesUrl(issuesUrl: string) {
    this.issues_url = issuesUrl;
  }

  public setSourceUrl(sourceUrl: string) {
    this.source_url = sourceUrl;
  }

  public setWikiUrl(wikiUrl: string) {
    this.wiki_url = wikiUrl;
  }

  public setDiscordUrl(discordUrl: string) {
    this.discord_url = discordUrl;
  }

  public setDonationUrls(donationUrls: Array<DonationUrl>) {
    this.donation_urls = donationUrls;
  }

  public setLicense(license: License) {
    this.license = license;
  }

  public setStatus(status: "approved" | "rejected" | "draft" | "unlisted" | "archived" | "processing" | "unknown") {
    this.status = status;
  }

  /**
   * Search for projects.
   * @param {string} query - The query to search for
   * @param {Object} options - Options to filter search results
   * @param {string} options.facets - The recommended way of filtering search results
   * @param {string} options.index - The sorting method used for sorting search results
   * @param {number} options.offset - The offset into the search. Skips this number of results
   * @param {number} options.limit - The number of results returned by the search
   * @param {string} options.filters - A list of filters relating to the properties of a project. Use filters when there isn't an available facet for your needs
   * @see https://docs.modrinth.com/docs/tutorials/api_search
   * @see https://docs.meilisearch.com/reference/features/filtering.html
   */
  public static async search(
    query: string,
    options?: {
      facets?: string;
      index?: string;
      offset?: number;
      limit?: number;
      filters?: string;
    }
  ): Promise<ResponseData> {
    const queryParams = new URLSearchParams({ query });
    if (options?.facets) queryParams.append("facets", options.facets);
    if (options?.index) queryParams.append("index", options.index);
    if (options?.offset)
      queryParams.append("offset", options.offset.toString());
    if (options?.limit) queryParams.append("limit", options.limit.toString());
    if (options?.filters) queryParams.append("filters", options.filters);

    const route = `/search?${queryParams}`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Request and update the project's data.
   */
  public async get(): Promise<void> {
    const route = `/project/${this.id}`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    const data = await toJson(response.body);

    this.slug = data.slug;
    this.title = data.title;
    this.description = data.description;
    this.categories = data.categories;
    this.client_side = data.client_side;
    this.server_side = data.server_side;
    this.body = data.body;
    this.additional_categories = data.additional_categories;
    this.issues_url = data.issues_url;
    this.source_url = data.source_url;
    this.wiki_url = data.wiki_url;
    this.discord_url = data.discord_url;
    this.donation_urls = data.donation_urls;
    this.project_type = data.project_type;
    this.downloads = data.downloads;
    this.icon_url = data.icon_url;
    this.id = data.id;
    this.team = data.team;
    this.moderator_message = data.moderator_message;
    this.published = data.published;
    this.updated = data.updated;
    this.approved = data.approved;
    this.followers = data.followers;
    this.status = data.status;
    this.license = data.licence;
    this.versions = data.versions;
    this.gallery = data.gallery;
  }

  /**
   * Get a project.
   * @param {string} idOrSlug - The ID or slug of the project
   */
  public static async get(
    idOrSlug: string
  ): Promise<ResponseData> {
    const route = `/project/${idOrSlug}`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Update project's data on Modrinth.
   * @param authToken
   */
  public async modify(authToken?: string): Promise<void> {
    const route = `/project/${this.id}`;
    const token = authToken ? authToken : config.authToken;

    await request(baseUrl + route, {
      method: "PATCH",
      headers: {
        authorization: token,
        "content-type": "application/json",
        "user-agent": config.userAgent,
      },
      body: JSON.stringify({
        slug: this.slug,
        title: this.title,
        description: this.description,
        categories: this.categories,
        client_side: this.client_side,
        server_side: this.server_side,
        body: this.body,
        additional_categories: this.additional_categories,
        issues_url: this.issues_url,
        source_url: this.source_url,
        wiki_url: this.wiki_url,
        discord_url: this.discord_url,
        donation_urls: this.donation_urls,
        license_id: this.license.id,
        license_url: this.license.url,
        status: this.status,
        moderation_message: this.moderator_message?.message,
        moderation_message_body: this.moderator_message?.body,
      }),
    });
  }

  /**
   * Modify a project.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {ModifiedProjectFields} modifiedProjectFields - The project's modified fields
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async modify(
    idOrSlug: string,
    modifiedProjectFields: ModifiedProjectFields,
    authToken?: string
  ): Promise<ResponseData> {
    const route = `/project/${idOrSlug}`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "PATCH",
      headers: {
        authorization: token,
        "content-type": "application/json",
        "user-agent": config.userAgent,
      },
      body: JSON.stringify(modifiedProjectFields),
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Delete a project.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async delete(idOrSlug: string, authToken?: string): Promise<ResponseData> {
    const route = `/project/${idOrSlug}`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "DELETE",
      headers: {
        authorization: token,
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Get multiple projects.
   * @param {Array<string>} ids - The IDs of the projects
   */
  static async getMultiple(ids: Array<string>): Promise<ResponseData> {
    const queryParams = new URLSearchParams({ ids });

    const route = `/projects?${queryParams}`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Create a project.
   * @param {FormData} newProject - The new project data
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async create(newProject: FormData, authToken?: string): Promise<ResponseData> {
    const route = "/project";
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "POST",
      headers: {
        authorization: token,
        "content-type": "multipart/form-data",
        "user-agent": config.userAgent,
      },
      body: newProject,
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Check if a project slug or ID exists.
   * @param {string} idOrSlug - The ID or slug of the project
   */
  public static async validate(idOrSlug: string): Promise<ResponseData> {
    const route = `/project/${idOrSlug}/check`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Add an image to a project's gallery. Modrinth allows you to upload files of up to 5MiB.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {{ ext: "png" | "jpg" | "jpeg" | "bmp" | "gif" | "webp" | "svg" | "svgz" | "rgb", featured: boolean, title?: string, description?: string }} imageData - The image metadata
   * @param {string} image - The binary of the image
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async addImage(
    idOrSlug: string,
    imageData: {
      ext:
        | "png"
        | "jpg"
        | "jpeg"
        | "bmp"
        | "gif"
        | "webp"
        | "svg"
        | "svgz"
        | "rgb";
      featured: boolean;
      title?: string;
      description?: string;
    },
    image: string,
    authToken?: string
  ): Promise<ResponseData> {
    const queryParams = new URLSearchParams();
    queryParams.append("ext", imageData.ext);
    queryParams.append("featured", imageData.featured.toString());
    if (imageData.title) queryParams.append("title", imageData.title);
    if (imageData.description)
      queryParams.append("description", imageData.description);

    const route = `/project/${idOrSlug}/gallery?${queryParams}`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "POST",
      headers: {
        authorization: token,
        "content-type": "image/*",
        "user-agent": config.userAgent,
      },
      body: image,
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Modify a gallery image.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param imageData - The metadata of the image
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async modifyImage(
    idOrSlug: string,
    imageData: {
      url: string;
      featured: boolean;
      title?: string;
      description?: string;
    },
    authToken?: string
  ): Promise<ResponseData> {
    const queryParams = new URLSearchParams();
    queryParams.append("url", imageData.url);
    queryParams.append("featured", imageData.featured.toString());
    if (imageData.title) queryParams.append("title", imageData.title);
    if (imageData.description)
      queryParams.append("description", imageData.description);

    const route = `/project/${idOrSlug}/gallery?${queryParams}`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "PATCH",
      headers: {
        authorization: token,
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Delete a gallery image
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {string} url - URL link of the image to delete
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async deleteImage(idOrSlug: string, url: string, authToken?: string): Promise<ResponseData> {
    const queryParams = new URLSearchParams();
    queryParams.append("url", url);

    const route = `/project/${idOrSlug}/gallery?${queryParams}`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "DELETE",
      headers: {
        authorization: token,
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Get all of a project's dependencies.
   * @param {string} idOrSlug - The ID or slug of the project
   */
  public static async getDependencies(idOrSlug: string): Promise<ResponseData> {
    const route = `/project/${idOrSlug}/dependencies`;

    const response = await request(baseUrl + route, {
      method: "GET",
      headers: {
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Follow a project.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async follow(idOrSlug: string, authToken?: string): Promise<ResponseData> {
    const route = `/project/${idOrSlug}/follow`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "POST",
      headers: {
        authorization: token,
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  /**
   * Unfollow a project.
   * @param {string} idOrSlug - The ID or slug of the project
   * @param {string} authToken - The authorization token to use. Overrides any token defined in the config
   */
  public static async unfollow(idOrSlug: string, authToken?: string): Promise<ResponseData> {
    const route = `/project/${idOrSlug}/follow`;
    const token = authToken ? authToken : config.authToken;

    const response = await request(baseUrl + route, {
      method: "DELETE",
      headers: {
        authorization: token,
        "user-agent": config.userAgent,
      },
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }
}

type ResponseData = {
  data: any | null,
  statusCode: number,
}

type ModifiedProjectFields = {
  slug: string;
  title: string;
  description: string;
  categories: Array<string>;
  client_side: "required" | "optional" | "unsupported";
  server_side: "required" | "optional" | "unsupported";
  body: string;
  additional_categories: Array<string>;
  issues_url: string | null;
  source_url: string | null;
  wiki_url: string | null;
  discord_url: string | null;
  donation_urls: Array<DonationUrl>;
  license_id: string;
  license_url: string | null;
  status:
    | "approved"
    | "rejected"
    | "draft"
    | "unlisted"
    | "archived"
    | "processing"
    | "unknown";
  moderation_message: string | null;
  moderation_message_body: string | null;
};

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

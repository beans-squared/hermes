import { FormData, request } from "undici";
import { config } from "../config.js";
import toJson from "../helpers/toJson.js";
import { parseForESLint } from "@typescript-eslint/parser";

const baseUrl = config.protocol + config.hostname + config.version;

/**
 * Routes related to projects on Modrinth.
 */
export default class ProjectRoutes {
  /**
   * Search for projects.
   * @param {string} query - The query to search for
   * @param {Object} options - Options to filter search results
   * @param {string} options.facets - The recommended way of filtering search results
   * @param {string} options.index - The sorting method used for sorting search results
   * @param {number} options.offset - The offset into the search. Skips this number of results
   * @param {number} options.limit - The number of results returned by the search
   * @param {string} options.filters - A list of filters relating to the properties of a project. Use filters when there isn't an available facet for your needs
   * @returns {Promise<{data: (null|any), statusCode: number}>}
   * @see https://docs.modrinth.com/docs/tutorials/api_search
   * @see https://docs.meilisearch.com/reference/features/filtering.html
   */
  static async search(
    query: string,
    options?: {
      facets?: string;
      index?: string;
      offset?: number;
      limit?: number;
      filters?: string;
    }
  ): Promise<{ data: null | any; statusCode: number }> {
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
   * Get a project.
   * @param {string} idOrSlug - The ID or slug of the project
   * @returns {Promise<{data: (null|any), statusCode: number}>}
   */
  static async get(
    idOrSlug: string
  ): Promise<{ data: null | any; statusCode: number }> {
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

  static async modify(
    idOrSlug: string,
    modifiedProjectFields: ModifiedProjectFields,
    authToken?: string
  ) {
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

  static async delete(idOrSlug: string, authToken?: string) {
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

  static async getMultiple(ids: Array<string>) {
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

  static async create(newProject: FormData, authToken?: string) {
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

  static async validate(idOrSlug: string) {
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

  static async addImage(
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
  ) {
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

  static async modifyImage(
    idOrSlug: string,
    imageData: {
      url: string;
      featured: boolean;
      title?: string;
      description?: string;
    },
    authToken?: string
  ) {
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

  static async deleteImage(idOrSlug: string, url: string, authToken?: string) {
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

  static async getDependencies(idOrSlug: string) {
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

  static async follow(idOrSlug: string, authToken?: string) {
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

  static async unfollow(idOrSlug: string, authToken?: string) {
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

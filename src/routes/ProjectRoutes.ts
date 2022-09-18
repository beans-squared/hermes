import { request } from "undici";
import { config } from "./config";
import { toJson } from "./util";

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
    });

    return {
      data: await toJson(response.body),
      statusCode: response.statusCode,
    };
  }

  static async modify() {}

  static async delete() {}

  static async getMultiple() {}

  static async create() {}

  static async validate() {}

  static async addImage() {}
}

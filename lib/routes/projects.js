const { RequestHandler } = require('../request-handler');

/** Projects can be mods or modpacks and are created by users. */
class Projects extends RequestHandler {
	/** Search projects. 
	 * 
	 * @param {string} query The query to search for
	 * @param {string} [facets] The recommended way of filtering search results. [Learn more about using facets.](https://docs.modrinth.com/docs/tutorials/api_search)
	 * @param {string} [index] The sorting method used for sorting search results. Defaults to `relevance`
	 * @param {number} [offset] The offset into the search. Skips this number of results. Defaults to `0`
	 * @param {number} [limit] The number of results returned by the search. Defaults to `10`
	 * @param {string} [filters] A list of filters relating to the properties of a project. Use filters when there isn't an available facet for your needs. [More Information](https://docs.meilisearch.com/reference/features/filtering.html)
	 * @deprecated @param {string} version A list of filters relating to the versions of a project. Use of facets for filtering by version is recommended
	*/
	async search(query, facets, index, offset, limit, filters, version) {
		const url_search_params = new URLSearchParams(query);
		if (facets) url_search_params.append('facets', facets);
		if (index) url_search_params.append('index', index);
		if (offset) url_search_params.append('offset', offset.toString());
		if (limit) url_search_params.append('filters', limit.toString());
		if (filters) url_search_params.append('filters', filters);

		return this.make_api_request(false, 'GET', '/search', url_search_params, undefined);
	}

	/** Get a project. 
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	*/
	async get(idOrSlug) {
		if (!Api.user_agent) throw new Error('missing user agent');

		try {
			const response_data = await request(`${Api.base_url}/project/${idOrSlug}`, {
				method: 'GET',
				headers: {
					'user-agent': Api.user_agent,
				},
			});
			return { success: true, reason: null, data: response_data };
		} catch (error) {
			return { success: false, reason: error, data: null };
		}
	}

	/** Modify a project. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 * @param {any} body application/json
	*/
	async modify(idOrSlug, body) {
		if (!Api.user_agent) throw new Error('missing user agent');
		if (!Api.auth_token) throw new Error('missing auth token');

		try {
			const response_data = await request(`${Api.base_url}/project/${idOrSlug}`, {
				method: 'PATCH',
				body: JSON.stringify(body),
				headers: {
					authorization: Api.auth_token,
					'user-agent': Api.user_agent,
				},
			});
			return { success: true, reason: null, data: response_data };
		} catch (error) {
			return { success: false, reason: error, data: null };
		}
	}

	/** Delete a project. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	*/
	async delete(idOrSlug) {

	}

	/** Get multiple projects.
	 * 
	 * @param {string[]} ids The IDs of the projects
	 */
	async getMultiple(ids) {

	}

	/** Create a project. Requires authorization. */
	async create() {

	}

	/** Check project slug/ID validity.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 */
	async validate(idOrSlug) {

	}

	/** Add a gallery image. Requires authorization.
	 * 
	 * Modrinth allows you to upload files of up to 5MiB to a project's gallery.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 * @param {string} ext Image extension
	 * @param {boolean} featured Whether an image is featured
	 * @param {string} [title] Title of the image
	 * @param {string} [description] Description of the image
	 */
	async addImage(idOrSlug, ext, featured, title, description) {

	}

	/** Modify a gallery image. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 * @param {string} url URL link of the image to modify
	 * @param {boolean} featured Whether the image is featured
	 * @param {string} [title] New title of the image
	 * @param {string} [description] New description of the image
	 */
	async modifyImage(idOrSlug, url, featured, title, description) {

	}

	/** Delete a gallery image. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 * @param {string} url URL link of the image to delete
	 */
	async deleteImage(idOrSlug, url) {

	}

	/** Get all of a project's dependencies.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 */
	async getDependencies(idOrSlug) {

	}

	/** Follow a project. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 */
	async follow(idOrSlug) {

	}

	/** Unfollow a project. Requires authorization.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 */
	async unfollow(idOrSlug) {

	}
}

module.exports = { Projects };
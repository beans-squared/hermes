import RequestHandler from "../request-handler";

/**  Versions contain download links to files with additional metadata. */
export default class Versions extends RequestHandler {

	/** List project's versions.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 * @param {string[]} [loaders] The types of loaders to filter for
	 * @param {string[]} [game_versions] The game versions to filter for
	 * @param {boolean} [featured] Allows to filter for featured or non-featured versions only
	 */
	async list(idOrSlug, loaders, game_versions, featured) {

	}

	/** Get a version.
	 * 
	 * @param {string} id The ID of the version
	 */
	async get(id) {

	}

	/** Modify a version. Requires authorization.
	 * 
	 * @param {string} id The ID of the version
	 * @param {any} body application/json
	 */
	async modify(id, body) {

	}

	/** Delete a version. Requires authorization.
	 * 
	 * @param {string} id The ID of the version
	 */
	async delete(id) {

	}

	/** Create a version. Requires authorization.
	 * 
	 * @param {any} data multipart/form-data
	 */
	async create(data) {

	}

	/** Get multiple versions.
	 * 
	 * @param {string[]} ids The IDs of the versions
	 */
	async getMultiple(ids) {

	}

	/** Add files to version. Requires authorization.
	 * 
	 * Project files are attached. `.mrpack` and `.jar` files are accepted.
	 * 
	 * @param {string} id The ID of the version
	 * @param {any} data multipart/form-data
	 */
	async addFiles(id, data) {

	}
}
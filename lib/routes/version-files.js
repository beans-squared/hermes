import RequestHandler from "../request-handler";

/** Versions can contain multiple files, and these routes help manage
 * those files.
 */
export default class VersionFiles extends RequestHandler {

	/** Get version from hash.
	 * 
	 * @param {string} hash The hash of the file, considering its byte content, and encoded in hexadecimal
	 * @param {string} algorithm The algorithm of the hash. Defaults to `sha1`
	 */
	async get(hash, algorithm) {

	}

	/** Delete a file from its hash. Requires authorization.
	 * 
	 * @param {string} hash The hash of the file, considering its byte content, and encoded in hexadecimal
	 * @param {string} algorithm The algorithm of the hash. Defaults to `sha1`
	 */
	async delete(hash, algorithm) {

	}

	/** Latest version of a project from a hash, loader(s), and game version(s).
	 * 
	 * @param {string} hash The hash of the file, considering its byte content, and encoded in hexadecimal
	 * @param {string} algorithm The algorithm of the hash. Defaults to `sha1`
	 * @param {any} body application/json
	 */
	async getLatestVersion(hash, algorithm, body) {

	}

	/** Get versions from hashes. 
	 * 
	 * This is the same as `/version_file/{hash}` except it accepts multiple hashes.
	 * 
	 * @param {any} body application/json
	*/
	async getMultiple(body) {

	}

	/** Latest versions of multiple project from hashes, loader(s), and game version(s).
	 * 
	 * This is the same as `/version_file/{hash}/update` except it accepts multiple hashes.
	 * 
	 * @param {any} body application/json
	 */
	async getMultipleLatestVersions(body) {

	}
}
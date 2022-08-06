import RequestHandler from "../request-handler";

/** Users can create projects, join teams, access notifications, manage settings, and
 * follow projects. Admins and moderators have more advanced permissions such as 
 * reviewing new projects.
 */
export default class Users extends RequestHandler {

	/** Get a user.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async get(idOrUsername) {

	}

	/** Modify a user. Requires authorization.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 * @param {any} body application/json
	 */
	async modify(idOrUsername, body) {

	}

	/** Delete a user. Requires authorization.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async delete(idOrUsername) {

	}

	/** Get user from authorization header. Requires authorization.*/
	async getFromAuthHeader() {

	}

	/** Get multiple users.
	 * 
	 * @param {string[]} ids The IDs of the users
	 */
	async getMultiple(ids) {

	}

	/** Change user's avatar. Requires authorization.
	 * 
	 * By default, Modrinth uses a user's GitHub icon. This route allows it to be changed to a custom one. The new avatar may be up to 2MiB in size.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 * @param {any} body multipart/form-data
	 */
	async changeAvatar(idOrUsername, body) {

	}

	/** Get user's projects.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async getProjects(idOrUsername) {

	}

	/** Get user's notifications. Requires authorization.
	 * 
	 * Notifications can be project updates or team invites.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async getNotifications(idOrUsername) {

	}

	/** Get user's followed projects. Requires authorization.
	 * 
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async getFollowedProjects(idOrUsername) {

	}

	/** Report a project, user, or version.
	 * 
	 * Bring a project, user, or version to the attention of the moderators by reporting it. You must be logged in to report anything.
	 * 
	 * @param {any} body application/json
	 */
	async report(body) {
		
	}
}
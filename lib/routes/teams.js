import RequestHandler from "../request-handler";

/** Through teams, user permissions limit how team members can modify projects. */
export default class Teams extends RequestHandler {

	/** Get a project's team members.
	 * 
	 * @param {string} idOrSlug The ID or slug of the project
	 */
	async getProjectMembers(idOrSlug) {

	}

	/** Get a team's members. Requires authorization.
	 * 
	 * @param {string} id The ID of the team
	 */
	async getTeamMembers(id) {

	}

	/** Add a user to a team. Requires authorization. 
	 * 
	 * @param {string} id The ID of the team
	 * @param {any} body application/json
	*/
	async addMember(id, body) {

	}

	/** Join a team. Requires authorization.
	 * 
	 * @param {string} id The ID of the team
	 */
	async join(id) {

	}

	/** Modify a team member's roles and/or permissions. Requires authorization.
	 * 
	 * @param {string} id The ID of the team
	 * @param {string} user_id The ID of the user to modify
	 * @param {any} body application/json
	 */
	async modifyMember(id, user_id, body) {

	}

	/** Remove a member from a team. Requires authorization.
	 * 
	 * @param {string} id The ID of the team
	 * @param {string} idOrUsername The ID or username of the user
	 */
	async removeMember(id, idOrUsername) {

	}

	/** Transter team's ownership to another user. Requires authorization.
	 * 
	 * @param {string} id The ID of the team
	 * @param {any} body application/json
	 */
	async transferOwnership(id, body) {
		
	}
}
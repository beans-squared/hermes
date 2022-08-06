const { FormData, request } = require('undici');

/** Main class for interaction with the Modrinth Labrinth API. 
 * @protected
*/
class RequestHandler {
	/** Your personal GitHub access token to use with the parts of the API that require authorization.
	 * 
	 * You can get your token by logging into Modrinth and navigating to your account settings, then to
	 * Security, and copying your token to your clipboard.
	 * 
	 * **Make sure to never let your person access token become public!** If your project's source code is
	 * publicly available on a site like GitHub, you should store your token in a config.json or .env file
	 * and import the token into your code. If you are developing an application like a launcher and you want
	 * different individual users, you should instead create your own GitHub OAuth2 application.
	 * 
	 * @see https://modrinth.com/settings/security
	 * @type {string}
	 */
	auth_token;

	/** Your application's user agent, so Modrinth can identify traffic sources using its API.
	 * 
	 * Providing a user agent that only identifies your HTTP client library (such as "okhttp/4.9.3") 
	 * increases the likelihood that Modrinth will block your traffic. It is recommended, but not required, 
	 * to include contact information in your user agent. This allows Modrinth to contact you if they would 
	 * like a change in your application's behavior without having to block your traffic.
	 * 
	 * - Bad: `okhttp/4.9.3`
	 * - Good: `my_awesome_launcher`
	 * - Better: `github_org/my_awesome_launcher/1.56.0`
	 * - Best: `github_org/my_awesome_launcher/1.56.0 (launcher.com)` or `github_org/my_awesome_launcher/1.56.0 (contact@launcher.com)`
	 * 
	 * @see https://docs.modrinth.com/api-spec/#section/User-Agents 
	 * @type {string}
	 */
	static user_agent;

	static base_url = 'https://api.modrinth.com/v2';

	/** The starting point for any request to Modrinth
	 * @param {string} userAgent
	 * @param {string} [authToken]
	 */
	constructor(userAgent, authToken) {
		this.auth_token = authToken;
		this.user_agent = userAgent;
	}

	/** Handles all requests to the API.
	 * @protected
	 * 
	 * @param {boolean} require_auth If the route requires authorization
	 * @param {HttpMethod} method The HTTP method for this route
	 * @param {string} path The path for this route
	 * @param {URLSearchParams} [query_params] The query parameters for this request
	 * @param {string | FormData} [body] The body data for this request
	 */
	async make_api_request(require_auth, method, path, query_params, body) {
		if (require_auth && !this.auth_token) throw new Error('missing auth token');

		try {
			const response_data = await request(this.base_url + path + query_params, {
				method: method,
				headers: {
					authorization: this.auth_token,
					'user-agent': this.user_agent,
				},
			});
			return { success: true, reason: null, data: response_data };
		} catch (error) {
			return { success: false, reason: error, data: null };
		}
	}
}

module.exports = { RequestHandler };
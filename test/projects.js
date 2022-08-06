const { RequestHandler } = require('../lib/request-handler');
const { Projects } = require('../lib/routes/projects');

require('dotenv').config();

const client = new RequestHandler(process.env.USER_AGENT, process.env.AUTH_TOKEN);

try {
	const requestData = Projects.search('sodium');
	console.log(requestData);
} catch (error) {
	console.log(error);
}
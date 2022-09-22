import assert from "node:assert";
import { MockAgent, request, setGlobalDispatcher } from "undici";

import { ProjectRoutes } from "../lib/index.js";

let sampleData = null;
async function getSampleData() {
	try {
		// Sample project (first one returned from blank search)
		let responseData = await request(`https://api.modrinth.com/v2/search`);
		let bodyContent = await responseData.body.json();
		let fetchedProject = bodyContent.hits[0];

		responseData = await request(`https://api.modrinth.com/v2/project/${fetchedProject.project_id}`);
		const sampleProject = await responseData.body.json();

		// Sample version (first listed in sample project)
		responseData = await request(`https://api.modrinth.com/v2/version/${sampleProject.versions[0]}`);
		const sampleVersion = await responseData.body.json();

		return { project: sampleProject, version: sampleVersion };
	} catch (error) {
		console.log('An error occurred while fetching sample data from Modrinth.');
	}
}

describe('Hermes', function() {
	const mockAgent = new MockAgent();
	setGlobalDispatcher(mockAgent);
	mockAgent.disableNetConnect();
	const mockPool = mockAgent.get("https://api.modrinth.com");
	describe('Routes', function() {
		describe('Projects', function() {
			describe('#search()', function() {
				it('should return code 200 for a blank search', async function() {
					mockPool.intercept({
						path: "/v2/search?query=",
						method: "GET",
						headers: {
							"user-agent": "",
						},
					}).reply(200);
					const result = await ProjectRoutes.search('');
					assert.deepEqual(result, { data: null, statusCode: 200 });
				});
			});
			describe('#get()', function() {
				it('should return code 200 for an existing ID', async function() {
					const idOrSlug = "ExistingId";
					mockPool.intercept({
						path: `/v2/project/${idOrSlug}`,
						method: "GET",
						headers: {
							"user-agent": "",
						},
					}).reply(200, {
						someProjectDataFields: "value",
					});
					const result = await ProjectRoutes.get(idOrSlug);
					assert.deepEqual(result, { data: { someProjectDataFields: "value" }, statusCode: 200 });
				});
				it('should return code 404 for a nonexistent ID', async function() {
					const idOrSlug = "NonExistantId";
					mockPool.intercept({
						path: `/v2/project/${idOrSlug}`,
						method: "GET",
						headers: {
							"user-agent": "",
						},
					}).reply(404);
					const result = await ProjectRoutes.get(idOrSlug);
					assert.deepEqual(result, { data: null, statusCode: 404 });
				});
			});
			describe("#modify()", function() {
				it("should return code 204 project modified successfully", async function() {
					const idOrSlug = "existingProjectId";
					const modifiedProjectFields = {
						slug: "modifiedSlug",
						title: "modifiedTitle",
						description: "modifiedDescription",
						categories: [
							"modifiedCategory1",
							"modifiedCategory2",
						],
						client_side: "required",
						issues_url: null,
						donation_urls: [
							{
								id: "platformId",
								platform: "platformName",
								url: "www.platform.com",
							},
						],
					};
					mockPool.intercept({
						path: `/v2/project/${idOrSlug}`,
						method: "PATCH",
						headers: {
							"authorization": "",
							"content-type": "application/json",
							"user-agent": "",
						},
						body: JSON.stringify(modifiedProjectFields),
					}).reply(204);
					const result = await ProjectRoutes.modify(idOrSlug, modifiedProjectFields);
					assert.deepEqual(result, { data: null, statusCode: 204 });
				});
				it("should return code 401 for an unauthorized token", async function() {
					const idOrSlug = "existingProjectId";
					const modifiedProjectFields = {
						slug: "modifiedSlug",
						title: "modifiedTitle",
						description: "modifiedDescription",
						categories: [
							"modifiedCategory1",
							"modifiedCategory2",
						],
						client_side: "required",
						issues_url: null,
						donation_urls: [
							{
								id: "platformId",
								platform: "platformName",
								url: "www.platform.com",
							},
						],
					};
					mockPool.intercept({
						path: `/v2/project/${idOrSlug}`,
						method: "PATCH",
						headers: {
							authorization: "",
							"content-type": "application/json",
							"user-agent": "",
						},
						body: JSON.stringify(modifiedProjectFields),
					}).reply(401, {
						error: "error",
						description: "description",
					});
					const result = await ProjectRoutes.modify(idOrSlug, modifiedProjectFields);
					assert.deepEqual(result, { data: { error: "error", description: "description" }, statusCode: 401 });
				});
			});
		});
	});
});
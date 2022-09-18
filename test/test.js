import assert from 'node:assert';
import { request } from 'undici';

import { ProjectRoutes } from '../index.js';

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
	describe('Routes', function() {
		describe('Projects', function() {
			describe('#search()', function() {
				it('should return code 200 for a blank search', async function() {
					const result = await ProjectRoutes.search('');
					assert.equal(result.statusCode, 200);
				});
			});
			describe('#get()', function() {
				it('should return code 200 for an existing ID', async function() {
					const sampleData = await getSampleData();
					const result = await ProjectRoutes.get(sampleData.project.id);
					assert.equal(result.statusCode, 200);
				});
				it('should return code 404 for a nonexistent ID', async function() {
					const result = await ProjectRoutes.get('ThisIdDoesNotExist');
					assert.equal(result.statusCode, 404);
				});
				it('should throw an error when a non-string value is passed', async function() {
					try {
						await ProjectRoutes.get(69);
					} catch (error) {
						if(error.name === 'TypeError') {
							assert.ok(true);
						} else {
							assert.ok(false, 'Function did not throw an error');
						}
					}
				});
			});
		});
	});
});
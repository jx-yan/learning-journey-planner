const request = require("supertest");
const app = require("../src/app");

describe("GET jobs/all", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/jobs/all");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
});

describe("GET jobs/allactive", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/jobs/allactive");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
});

describe("GET jobs/search/:jobid/skills", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/jobs/search/1/skills");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
	it(`should return error message`, async () => {
		const response = await request(app).get(`/jobs/search/341212/skills`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("PUT jobs/toggle-id/:jobid", () => {
	it(`should return error message if :id is not entered`, async () => {
		const response = await request(app).put(`/jobs/toggle-id/:jobid`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("PUT jobs/delete-name/:name", () => {
	it(`should return error message if :name is not entered`, async () => {
		const name = null;
		const response = await request(app).put(`/jobs/delete-name/${name}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("POST jobs/add", () => {
	it(`should return error message that job already existed`, async () => {
		const response = await request(app).post("/jobs/add").send({
			jobName: "Sales Representative",
			jobDesc: "",
            jobDeptId: 1,
            jobSkills: []
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
	it(`should return success message that job added`, async () => {
		function getRandomString(length) {
			var randomChars =
				"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
			var result = "";
			for (var i = 0; i < length; i++) {
				result += randomChars.charAt(
					Math.floor(Math.random() * randomChars.length)
				);
			}
			return result;
		}

		const testJobTitle = getRandomString(10);
		const testJobDesc = getRandomString(10);
        const testJobDeptId = 1;

		const response = await request(app).post("/jobs/add").send({
			jobName: testJobTitle,
			jobDesc: testJobDesc,
			jobDeptId: testJobDeptId,
            jobSkills: []
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("success");
		await request(app).delete(`/jobs/hard-delete-name/${testJobTitle}`);
	});
});

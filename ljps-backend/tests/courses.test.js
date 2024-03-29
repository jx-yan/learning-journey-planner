const request = require("supertest");
const app = require("../src/app");

describe("GET courses/all/", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/courses/all");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
});

describe("GET courses/search/skill/:skillid", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/courses/search/skill/3");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
	it(`should return error message when no result`, async () => {
		const response = await request(app).get("/courses/search/skill/1000");
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

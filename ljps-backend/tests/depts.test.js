const request = require("supertest");
const app = require("../src/app");

describe("GET depts/all", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/depts/all");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
});

describe("GET depts/search/:deptname", () => {
	it(`should return json object`, async () => {
		const response = await request(app).get("/depts/search/Finance");
		expect(response.statusCode).toBe(200);
		expect(typeof response.body).toEqual("object");
	});
	it(`should return error message`, async () => {
		const response = await request(app).get(`/depts/search/:deptname`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("DELETE depts/delete_id/:id", () => {
	it(`should return error message if :id is not entered`, async () => {
		const id = null;
		const response = await request(app).delete(`/depts/delete_id/${id}`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("POST depts/add", () => {
	it(`should return error message that department already existed`, async () => {
		const testDept = await request(app).get("/depts/search/1")
		const testDeptName = testDept.DeptName;
		const response = await request(app).post("/depts/add").send({
			deptName: testDeptName,
			deptDesc: "",
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
	it(`should return success message that department added`, async () => {
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

		const testDeptName = getRandomString(10);
		const testDeptDesc = getRandomString(10);

		const response = await request(app).post("/depts/add").send({
			deptName: testDeptName,
			deptDesc: testDeptDesc,
		});
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe(`Department successfully added`);
		await request(app).delete(`/depts/delete_name/${testDeptName}`);
	});
});

describe("PUT depts/update/:id", () => {
	it(`should return error message if :id is not entered`, async () => {
		const id = null;
		const response = await request(app).put(`/depts/update/${id}`).send({
			deptName: "",
			deptDesc: "",
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
	it(`should return error message if deptName is not entered`, async () => {
		const id = 1;
		const response = await request(app).put(`/depts/update/${id}`).send({
			deptName: "",
			deptDesc: "test dept desc",
		});
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

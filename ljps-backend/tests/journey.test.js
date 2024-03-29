const request = require("supertest");
const app = require("../src/app");
const prisma = require("../src/config/init").prisma;

describe("GET journey/all/:StaffID", () => {
	it(`should return array of json objects`, async () => {
		const response = await request(app).get("/journey/all/1");
		expect(response.statusCode).toBe(200);
		expect(Array.isArray(response.body)).toEqual(true);
	});
	it(`should return error message`, async () => {
		const response = await request(app).get(`/journey/all/abc`);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("POST journey/add", () => {
	it(`should return success message that journey added`, async () => {
		const testdata = {
			JourneyName: "journeytest",
			JourneyDesc: "journeytest",
			JobID: 1,
			StaffID: 1,
			Courses: [1]
		};
		const response = await request(app).post("/journey/add").send(testdata);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe("Journey successfully added");
	});

	it(`should return error message that journey exists already`, async () => {
		const testexistdata = {
			JourneyName: "journeytest",
			JourneyDesc: "journeytest",
			JobID: 1,
			StaffID: 1,
		};
		const response = await request(app)
			.post("/journey/add")
			.send(testexistdata);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("DELETE journey/delete/:id", () => {
	it(`should return successful delete message`, async () => {
		// test helper function
		const testid = await prisma.LearningJourneys.findUnique({
			where: {
				JourneyName: "journeytest",
			},
			select: {
				JourneyID: true,
			},
		});
		const response = await request(app).delete(
			`/journey/delete/${testid.JourneyID}`
		);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe("Journey successfully deleted");
	});
});

describe("PUT addcourse to journey", () => {
	it(`should return successful message of adding course to journey`, async () => {
        const testCourseID = await (
            await request(app).get("/courses/all/")
        ).body[0].CourseID;
		const testdata = {
			JourneyID: 43,
			CourseID: testCourseID,
		};
		const response = await request(app)
			.put(`/journey/addcourse`)
			.send(testdata);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe(
			"Course successfully added into Journey"
		);
	});
	it(`should return error message if invalid JourneyID or CourseID is given`, async () => {
		const testdata = {
			JourneyID: 2,
			CourseID: 1000,
		};
		const response = await request(app)
			.put(`/journey/addcourse`)
			.send(testdata);
		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("error");
	});
});

describe("PUT deletecourse from journey", () => {
	it(`should return successful message of deleting course from journey`, async () => {
		
		const testCourseID = await (
			await request(app).get("/courses/all/")
		).body[1].CourseID;

		const testdata = {
			JourneyID: 43,
			CourseID: testCourseID,
		};

		await request(app)
		.put(`/journey/addcourse`)
		.send(testdata);

		const response = await request(app)
			.put(`/journey/deletecourse`)
			.send(testdata);
		expect(response.statusCode).toBe(200);
		expect(response.body.message).toBe(
			"Course successfully delete from Journey"
		);
	});
	it(`should return error message if last course in learning journey`, async () => {
        const testCourseID = await (
            await request(app).get("/courses/all/")
        ).body[0].CourseID;

		const testdata = {
			JourneyID: 43,
			CourseID: testCourseID,
		};
		
		const response = await request(app)
			.put(`/journey/deletecourse`)
			.send(testdata);
		expect(response.statusCode).toBe(200);
		expect(response.body.error).toBe(
			"Cannot delete only course in learning journey"
		);
	});
});
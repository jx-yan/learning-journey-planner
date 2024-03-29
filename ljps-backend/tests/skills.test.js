const request = require("supertest");
const app = require("../src/app");

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

describe("GET skills/all", () => {
    it(`should return array of json objects`, async () => {
        const response = await request(app).get("/skills/all");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
    });
});

describe("GET skills/allactive", () => {
    it(`should return array of json objects`, async () => {
        const response = await request(app).get("/skills/allactive");
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toEqual(true);
    });
});

describe("GET skills/search/:name", () => {
    it(`should return json object`, async () => {
        const response = await request(app).get(
            "/skills/search/Frontend%20Development"
        );
        expect(response.statusCode).toBe(200);
        expect(typeof response.body).toEqual("object");
    });
    it(`should return error message`, async () => {
        const response = await request(app).get(`/skills/search/:name`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("error");
    });
});

describe("POST skills/add", () => {
    it(`should return error message that skill name already exists`, async () => {
        const testSkillName = await (
            await request(app).get("/skills/all/")
        ).body[0].SkillName;
        const response = await request(app).post("/skills/add").send({
            skillName: testSkillName,
            skillDesc: "",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Skill name already exists");
    });
    it(`should return success message that skill has been added`, async () => {
        const testSkillName = getRandomString(10);
        const testSkillDesc = getRandomString(10);

        const response = await request(app).post("/skills/add").send({
            skillName: testSkillName,
            skillDesc: testSkillDesc,
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(`Skill successfully added`);
        await request(app).delete(`/skills/delete/${testSkillName}`);
    });
});

describe("PUT skills/softdelete/:name", () => {
    it(`should return error message if name is not entered`, async () => {
        const name = null;
        const response = await request(app).put(`/skills/softdelete/${name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.cause).toBe(`Record to update not found.`);
    });
    it(`should return soft skill deleted sucessfully`, async () => {
        const testDelete = "Java";
        const response = await request(app).put(
            `/skills/softdelete/${testDelete}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(`Skill successfully soft deleted`);
    });
});

describe("PUT skills/active/:name", () => {
    it(`should return error message if name is not entered`, async () => {
        const name = null;
        const response = await request(app).put(`/skills/active/${name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.cause).toBe(`Record to update not found.`);
    });
    it(`should return soft skill deleted sucessfully`, async () => {
        const testActive = "Java";
        const response = await request(app).put(`/skills/active/${testActive}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(`Skill successfully active`);
    });
});

describe("DELETE skills/delete/:name", () => {
    it(`should return error message if name is not entered`, async () => {
        const name = null;
        const response = await request(app).delete(`/skills/delete/${name}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.cause).toBe(`Record to delete does not exist.`);
    });
    it(`should return skill deleted sucessfully`, async () => {
        const testDelete = "testDelete";
        await request(app).post("/skills/add").send({
            skillName: testDelete,
            skillDesc: "",
        });
        const response = await request(app).delete(
            `/skills/delete/${testDelete}`
        );
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(`Skill successfully deleted`);
    });
});

describe("PUT skills/update/:name", () => {
    it(`should return error message if name is not entered`, async () => {
        const name = null;
        const response = await request(app).put(`/skills/update/${name}`).send({
            skillNameChange: "",
            skillDescriptionChange: "",
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.cause).toBe("Record to update not found.");
    });
    it(`should return error message if skill name is duplicate`, async () => {
        const testSkillName = await (
            await request(app).get("/skills/all/")
        ).body[0].SkillName;

        const duplicateSkillName = await (
            await request(app).get("/skills/all/")
        ).body[1].SkillName;

        const response = await request(app)
            .put(`/skills/update/${testSkillName}`)
            .send({
                skillNameChange: duplicateSkillName,
                skillDescriptionChange: "",
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Skill name already exists");
    });
    it(`should return error message if skill name field is empty`, async () => {
        const testSkillName = await (
            await request(app).get("/skills/all/")
        ).body[0].SkillName;

        const response = await request(app)
            .put(`/skills/update/${testSkillName}`)
            .send({
                skillNameChange: testSkillName,
                skillDescriptionChange: null,
            });
        expect(response.statusCode).toBe(200);
        expect(response.body.error).toBe("Please fill all the fields");
    });
});

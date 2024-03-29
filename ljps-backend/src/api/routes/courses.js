const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();
// const courseTypeList = ["Internal", "External"];
// const courseStatusList = ["Active", "Pending", "Retired"];
// const coursecategorylist = [
// 	"Core",
// 	"Finance",
// 	"HR",
// 	"Management",
// 	"Sales",
// 	"Technical",
// ];
router.get("/all", async (req, res) => {
    try {
        const courses = await prisma.courses.findMany({
            include: {
                Skills: true,
            },
        });
        res.send(courses);
    } catch (error) {
        console.log(error);
    }
});

router.get("/search/skill/:skillid", async (req, res) => {
    try {
        const { skillid } = req.params;
        const courses = await prisma.courses.findMany({
            where: {
                Skills: {
                    some: {
                        SkillID: parseInt(skillid),
                    },
                },
                CourseStatus: "Active",
            },
            include: {
                Skills: true,
            },
        });
        if (courses.length > 0) {
            res.json(courses);
        } else {
            res.json({
                error: `There is no courses with the skill in database`,
            });
        }
    } catch (error) {
        console.log(error);
        res.json(error.meta);
    }
});

router.put("/editCourseDetails/:courseid", async (req, res) => {
    const { courseid } = req.params;
    var itemsToEdit = req.body;
    var skillsToAdd = itemsToEdit.skillsToAddToCourse;
    var skillsIDtoRemove = itemsToEdit.skillsToRemoveFromCourse;

    try {
        // pass in skillsArr as an array of skillIDs
        if (
            courseid == ":courseid" ||
            courseid == null ||
            courseid == undefined
        ) {
            res.json({ error: "No Course ID provided" });
        } else {
            const courseFound = await prisma.courses.findUnique({
                where: {
                    CourseID: parseInt(courseid),
                },
            });
            if (courseFound) {
                let skillIdsToAdd = [];
                for (let addskillId of skillsToAdd) {
                    skillIdsToAdd.push({ SkillID: addskillId });
                }
                let skillsToRemove = [];
                for (let removeSkillId of skillsIDtoRemove) {
                    skillsToRemove.push({ SkillID: removeSkillId });
                }
                const result = await prisma.courses.update({
                    where: {
                        CourseID: parseInt(courseid),
                    },
                    data: {
                        Skills: {
                            connect: skillIdsToAdd,
                            disconnect: skillsToRemove,
                        },
                    },
                });
                if (result) {
                    res.json({
                        message: `Successfully updated Skills `,
                    });
                } else {
                    res.json({
                        error: `Failed to update Course skills`,
                    });
                }
            } else {
                res.json({ error: `Course with CourseID ${courseid} does not exist` });
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ error: "An Error occured while updating Job" });
    }
});

router.get("/search/:courseid", async (req, res) => {
    const { courseid } = req.params;
    try {
        if (courseid == ":courseid" || courseid == null) {
            res.json({ error: `Please enter a course ID` });
        } else {
            const result = await prisma.courses.findUnique({
                where: {
                    CourseID: parseInt(courseid),
                },
                include: {
                    Skills: true,
                },
            });
            if (result) {
                res.json(result);
            } else {
                res.json({ error: `No records of courseID of ${courseid}` });
            }
        }
    } catch (error) {
        console.log(error);
        res.json(error.meta);
    }
});
router.post("/add", async (req, res) => {
    try {
        const {
            courseid,
            coursecode,
            coursename,
            coursedesc,
            coursetype,
            coursestatus,
            coursecategory,
            skills,
        } = req.body;
        if (
            courseid == undefined ||
            coursename == undefined ||
            coursedesc == undefined ||
            coursetype == undefined ||
            coursestatus == undefined ||
            coursecategory == undefined ||
            coursecode == undefined
        ) {
            res.json({ error: `Please fill in all necessary details` });
        } else {
            const coursesIDduplicate = await prisma.courses.findFirst({
                where: {
                    CourseID: parseInt(courseid),
                },
            });
            if (coursesIDduplicate) {
                res.json({ error: `Course ${courseid} already exists` });
                // } else if (!(coursetype in courseTypeList)) {
                //   res.json({ error: `Wrong Course Type` });
                // } else if (!(coursestatus in courseStatusList)) {
                //   res.json({ error: `Wrong course Status` });
                // } else if (!(coursecategory in coursecategorylist)) {
                //   res.json({
                //     error: `Wrong course category`,
                //   });
                // }
            } else {
                const result = await prisma.courses.create({
                    data: {
                        CourseID: courseid,
                        CourseCode: coursecode,
                        CourseName: coursename,
                        CourseDesc: coursedesc,
                        CourseType: coursetype,
                        CourseStatus: coursestatus,
                        CourseCategory: coursecategory,
                        SkillsRequired: skills,
                    },
                });
                if (result) {
                    res.json({ message: `Course successfully added` });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.json({ error: `Failed to add course` });
    }
});
router.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await prisma.courses.delete({
            where: {
                CourseID: parseInt(id),
            },
        });
        if (result) {
            res.json({ message: `Course deleted successfully` });
        }
    } catch (error) {
        res.json({ error: error.meta.cause });
    }
});
module.exports = router;

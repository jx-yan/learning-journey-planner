const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();

// [{"JourneyID":2,"Job":{"JobName":"Frontend Engineer","SkillsRequired":[{"SkillID":2,"SkillName":"Frontend Development","SkillDesc":" Developing new user-facing features, determining the structure and design of web pages, building reusable codes, optimizing page loading times, and using a variety of markup languages to create the web pages"}]},"Courses":[]}]
// Get all Learning journeys of Staff by StaffID #edited to reflect softdelete
router.get("/all/:StaffID", async (req, res) => {
    try {
        const { StaffID } = req.params;
        const journeys = await prisma.LearningJourneys.findMany({
            where: {
                Staff: {
                    some: {
                        StaffID: parseInt(StaffID),
                    },
                },
            },
            select: {
                JourneyID: true,
                JourneyName: true,
                Job: {
                    select: {
                        JobName: true,
                        SkillsRequired: {
                            where:{
                                SkillStatus:true    
                            }
                        },
                    },
                },
                Courses: true,
            },
        });
        if (journeys.length > 0) {
            res.send(journeys);
        } else {
            res.json({ error: `No Journey Found for Staff` });
        }
    } catch (error) {
        // console.log(error)
        res.json({ error: `Invalid StaffID` });
    }
});

// add a journey
router.post("/add", async (req, res) => {
    try {
        const { JourneyName, JourneyDesc, JobID, StaffID, Courses } = req.body;
        let coursesArray = [];
        for (let courseID of Courses){
            coursesArray.push({CourseID:courseID})
        }
        const JourneyNameDuplicate = await prisma.LearningJourneys.findUnique({
            where: {
                JourneyName: JourneyName,
            },
        });
        if (coursesArray.length < 1) {
            res.json({error: "Please Select at least one course for your jouney"})
        }
        else if (JourneyNameDuplicate) {
            res.json({ error: `JourneyName exists already` });
        } 
        else {
            const result = await prisma.LearningJourneys.create({
                data: {
                    JourneyName: JourneyName,
                    JourneyDesc: JourneyDesc,
                    JobID: JobID,
                    Staff: { connect: { StaffID: StaffID } },
                    Courses: { connect: coursesArray },
                },
            });
            if (result) {
                res.json({ message: `Journey successfully added` });
            } else {
                res.json({ error: `Failed to add Journey` });
            }
        }
    } catch (error) {
        res.json({ error: `Failed to add Journey` });
    }
});

// add courses to journey
router.put("/addcourse", async (req, res) => {
    const { JourneyID, CourseID } = req.body;
    try {
        const result = await prisma.LearningJourneys.update({
            where: {
                JourneyID: parseInt(JourneyID),
            },
            data: {
                Courses: {
                    connect: { CourseID: parseInt(CourseID) },
                },
            },
        });
        if (result) {
            res.json({ message: `Course successfully added into Journey` });
        }
    } catch (error) {
        res.json({ error: "Failed to add Course to Journey" });
    }
});

// delete courses from journey
router.put("/deletecourse", async (req, res) => {
    const { JourneyID, CourseID } = req.body;
    try {
        const journey = await prisma.LearningJourneys.findUnique({
            where: {
                JourneyID: parseInt(JourneyID),
            },
            select: {
                Courses: true,
            },
        })
        if ((journey.Courses.length == 1)) {
            res.json({
                error: `Cannot delete only course in learning journey`,
            });
        } else {
            const result = await prisma.LearningJourneys.update({
                where: {
                    JourneyID: parseInt(JourneyID),
                },
                data: {
                    Courses: {
                        disconnect: { CourseID: parseInt(CourseID) },
                    },
                },
            });
            if (result) {
                res.json({
                    message: `Course successfully delete from Journey`,
                });
            }
        }
    } catch (error) {
        res.json({ error: "Failed to delete Course from Journey" });
    }
});

// delete a journey by sending JourneyID -- Done
router.delete("/delete/:JourneyID", async (req, res) => {
    const { JourneyID } = req.params;
    try {
        const JourneyIDFound = await prisma.LearningJourneys.findUnique({
            where: {
                JourneyID: parseInt(JourneyID),
            },
        });
        if (JourneyIDFound) {
            const result = await prisma.LearningJourneys.delete({
                where: {
                    JourneyID: parseInt(JourneyID),
                },
            });
            if (result) {
                res.json({ message: `Journey successfully deleted` });
            }
        } else {
            res.json({ error: `Invalid JourneyID` });
        }
    } catch (error) {
        res.json({ error: `Failed to delete Journey` });
    }
});

module.exports = router;

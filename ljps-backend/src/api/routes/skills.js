const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();

// FOR HR: get all skills to see everything- DONE
router.get("/all", async (req, res) => {
    try {
        const skills = await prisma.skills.findMany();
        if (skills.length > 0) {
            res.json(skills);
        } else {
            res.json({ error: `There is no skills in the database` });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// For Staff: get all skills that is active
router.get("/allactive", async (req, res) => {
    try {
        const skills = await prisma.skills.findMany({
            where: {
                SkillStatus: true,
            },
        });
        if (skills.length > 0) {
            res.json(skills);
        } else {
            res.json({ error: `There is no skills in the database` });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// get skills with a specific skillname
router.get("/search/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await prisma.skills.findUnique({
            where: {
                SkillName: name,
            },
        });
        if (result) {
            res.json(result);
        } else {
            res.json({ error: "Skill not found" });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// add new skill - DONE
router.post("/add", async (req, res) => {
    try {
        const { skillName, skillDesc } = req.body;
        const skillNameDuplicate = await prisma.skills.findUnique({
            where: {
                SkillName: skillName,
            },
        });

        if (skillNameDuplicate) {
            res.json({ error: `Skill name already exists` });
        } else {
            const result = await prisma.skills.create({
                data: {
                    SkillName: skillName,
                    SkillDesc: skillDesc,
                },
            });
            if (result) {
                res.json({ message: `Skill successfully added` });
            }
        }
    } catch (error) {
        res.json({ error: "Failed to add skill" });
    }
});

// update skill by skillname - DONE
router.put("/update/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const thingsToEdit = req.body;
        let skillName = thingsToEdit.skillNameChange;
        let skillDesc = thingsToEdit.skillDescriptionChange;
        const skillNameDuplicate = await prisma.skills.findUnique({
            where: {
                SkillName: skillName,
            },
        });

        if (skillName == null || skillDesc == null) {
            res.json({ error: `Please fill all the fields` });
        } else if (skillNameDuplicate && skillName != name) {
            res.json({ error: `Skill name already exists` });
        } else {
            const result = await prisma.skills.update({
                where: {
                    SkillName: name,
                },
                data: {
                    SkillName: skillName,
                    SkillDesc: skillDesc,
                },
            });
            if (result) {
                res.json({ message: `Skill successfully updated` });
            }
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// soft delete a skill by skillname by updating the SkillStatus
router.put("/softdelete/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await prisma.skills.update({
            where: {
                SkillName: name,
            },
            data: {
                SkillStatus: false,
            },
        });
        if (result) {
            res.json({ message: `Skill successfully soft deleted` });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// Active soft deleted skill by skillname by updating the SkillStatus
router.put("/active/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await prisma.skills.update({
            where: {
                SkillName: name,
            },
            data: {
                SkillStatus: true,
            },
        });
        if (result) {
            res.json({ message: `Skill successfully active` });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

// delete a skill by skillname - DONE
router.delete("/delete/:name", async (req, res) => {
    const { name } = req.params;
    try {
        const result = await prisma.skills.delete({
            where: {
                SkillName: name,
            },
        });
        if (result) {
            res.json({ message: `Skill successfully deleted` });
        }
    } catch (error) {
        res.json(error.meta);
    }
});

module.exports = router;

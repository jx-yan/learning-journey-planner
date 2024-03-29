const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();

// get all staff - DONE
router.get("/all", async (req, res) => {
	try {
		const staff = await prisma.staff.findMany();
		if (staff.length > 0) {
			res.json(staff);
		} else {
			res.json({ error: `There is no staff in the database` });
		}
	} catch (error) {
		res.json(error.meta);
	}
});

// get staff by staffcode - DONE
router.get("/search/:staffcode", async (req, res) => {
	const { staffcode } = req.params;
	try {
		if (staffcode == ":staffcode" || staffcode == null) {
			res.json({ error: `Please fill in a staffcode` });
		} else {
			const result = await prisma.staff.findUnique({
				where: {
					StaffCode: staffcode,
				},
			});
			if (result) {
				res.json(result);
			} else {
				res.json({ error: `Staff ${staffcode} not found` });
			}
		}
	} catch (error) {
		console.log(error)
		res.json(error.meta);
	}
});

// // get staff by staffname
// router.get("/search/:name", async (req, res) => {
// 	const { name } = req.params;
// 	try {
// 		const result = await prisma.staff.findMany({
// 			where: {
// 				StaffName: name,
// 			},
// 		});
// 		if (result) {
// 			res.json(result);
// 		}
// 	} catch (error) {
// 		res.json(error.meta);
// 	}
// });

// get staff by dept
// router.get("/search/:dept", async (req, res) => {
// 	const { dept } = req.params;
// 	try {
// 		const result = await prisma.staff.findMany({
// 			where: {
// 				Dept: dept,
// 			},
// 		});
// 		if (result) {
// 			res.json(result);
// 		}
// 	} catch (error) {
// 		res.json(error.meta);
// 	}
// });

// get all skills acquired by staffcode - DONE
router.get("/search/:staffcode/skills", async (req, res) => {
	const { staffcode } = req.params;
	try {
		if (staffcode == ":staffcode" || staffcode == null) {
			res.json({ error: `Please fill in a staffcode` });
		} else {
			const result = await prisma.staff.findUnique({
				where: {
					StaffCode: staffcode,
				},
				include: {
					SkillsAcquired: true,
				},
			});
			if (result) {
				res.json(result.SkillsAcquired);
			} else {
				res.json({ error: `Staff ${staffcode} not found` });
			}
		}
	} catch (error) {
		res.json(error.meta);
	}
});

// add new staff - DONE
router.post("/add", async (req, res) => {
	try {
		const { staffCode, staffFName, staffLName, staffEmail, staffDeptID } =
			req.body;

		if (staffCode == undefined || staffFName == undefined || staffLName == undefined || staffEmail == undefined || staffDeptID == undefined) {
			res.json({ error: `Please fill in all fields` });
		} else {
			const staffCodeDuplicate = await prisma.staff.findUnique({
				where: {
					StaffCode: staffCode,
				},
			});

			if (staffCodeDuplicate) {
				res.json({ error: `Staff with ${staffCode} already exists` });
			} else {
				const result = await prisma.staff.create({
					data: {
						StaffCode: staffCode,
						Staff_FName: staffFName,
						Staff_LName: staffLName,
						StaffEmail: staffEmail,
						Dept: {
							connect: { DeptID: parseInt(staffDeptID) },
						},
					},
				});
				if (result) {
					res.json({ message: `Staff successfully added` });
				}
			}
		}
	} catch (error) {
		console.log(error);
		res.json({ error: "Failed to add staff" });
	}
});

// add skills to staff by staffcode (Must be existing skills) - DONE
router.put("/addskills/:staffcode", async (req, res) => {
	const { staffcode } = req.params;
	try {
		// pass in skillsArr as an array of skillIDs
		const { skillIdArr } = req.body;
		if (staffcode == ":staffcode" || skillIdArr == undefined) {
			res.json({ error: "Please provide the required fields" });
		} else if (!Array.isArray(skillIdArr)) {
			res.json({ error: "Please provide an array of skill IDs" });
		} else {
			const staffCodeFound = await prisma.staff.findUnique({
				where: {
					StaffCode: parseInt(staffcode),
				},
			});
			if (staffCodeFound) {
				let skillsIdNotFound = [];
				for (let skillId of skillIdArr) {
					const skillFound = await prisma.skills.findFirst({
						where: {
							SkillID: skillId,
						},
					});
					if (!skillFound) {
						skillsIdNotFound.push(skillId);
					}
				}

				if (skillsIdNotFound.length > 0) {
					res.json({ error: `Skills with ID ${skillsIdNotFound} not found` });
				} else {
					let skillsIdAlreadyExists = [];
					for (let skillId of skillIdArr) {
						skillsIdAlreadyExists.push({ SkillID: skillId });
					}
					const result = await prisma.staff.update({
						where: {
							StaffCode: staffcode,
						},
						data: {
							SkillsAcquired: {
								connect: skillsIdAlreadyExists,
							},
						},
					});
					if (result) {
						res.json({ message: `Skills successfully added to staff` });
					} else {
						res.json({ error: `Failed to add skills to staff ${staffcode}` });
					}
				}
			} else {
				res.json({ error: `Staff with ${staffcode} does not exist` });
			}
		}
	} catch (error) {
		console.log(error);
		res.json({ error: "Failed to add skills to staff" });
	}
});

// update staff by staffcode
// router.put("/update/:code", async (req, res) => {
// 	const { code } = req.params;
// 	try {
// 		const { staffName, dept, skills } = req.body;
// 		const staffCodeDuplicate = await prisma.staff.findUnique({
// 			where: {
// 				StaffCode: staffCode,
// 			},
// 		});

// 		if (staffCodeDuplicate) {
// 			res.json({ error: `Staff with ${staffCode} already exists` });
// 		} else {
// 			const result = await prisma.staff.update({
// 				where: {
// 					StaffCode: code,
// 				},
// 				data: {
// 					StaffName: staffName,
// 					Dept: dept,
// 					Skills: skills,
// 				},
// 			});
// 			if (result) {
// 				res.json({ message: `Staff successfully updated` });
// 			}
// 		}
// 	} catch (error) {
// 		res.json(error.meta);
// 	}
// });

// update staff by staffname

// delete staff by staffcode - DONE
router.delete("/delete/:staffcode", async (req, res) => {
	const { staffcode } = req.params;
	try {
		if (staffcode.length > 0) {
			const result = await prisma.staff.delete({
				where: {
					StaffCode: staffcode,
				},
			});
			if (result) {
				res.json({ message: `Staff successfully deleted` });
			}
		} else {
			res.json({ error: `Please fill in all fields` });
		}
	} catch (error) {
		res.json({ error: error.meta });
	}
});

// delete staff by staffname
module.exports = router;
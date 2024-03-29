const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();

// get all depts - DONE
router.get("/all", async (req, res) => {
	try {
		const depts = await prisma.departments.findMany();
		res.send(depts);
	} catch (error) {
		res.json(error.meta);
	}
});

// get dept by deptName - DONE
router.get("/search/:deptname", async (req, res) => {
	const { deptname } = req.params;
	try {
		if (deptname.length > 0 && deptname !== ":deptname") {
			const dept = await prisma.departments.findUnique({
				where: {
					DeptName: deptname,
				},
			});
			res.send(dept);
		} else {
			res.json({ error: "Please enter a department name" });
		}
	} catch (error) {
		console.log(error);
		res.json({ error: `Failed to retrieve department ID of ${deptname}` });
	}
});

// add a dept - DONE
router.post("/add", async (req, res) => {
	try {
		const { deptName, deptDesc } = req.body;

		const deptNameDuplicate = await prisma.departments.findUnique({
			where: {
				DeptName: deptName,
			},
		});

		if (deptNameDuplicate) {
			res.json({ error: `Department name already exists` });
		} else {
			const result = await prisma.departments.create({
				data: {
					DeptName: deptName,
					DeptDesc: deptDesc,
				},
			});
			if (result) {
				res.json({ message: `Department successfully added` });
			} else {
				res.json({ error: `Failed to add department` });
			}
		}
	} catch (error) {
		res.json({ error: `Failed to add department` });
	}
});

// update a dept by deptID - DONE
router.put("/update/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const { deptName, deptDesc } = req.body;

		const deptNameDuplicate = await prisma.departments.findUnique({
			where: {
				DeptName: deptName,
			},
		});

		if (
			deptName.length == 0 ||
			deptDesc.length == 0 ||
			id == ":id" ||
			id.length == 0 ||
			id == null ||
			id == undefined
		) {
			res.json({ error: `Please fill all the fields` });
		} else if (deptNameDuplicate) {
			res.json({ error: `Department name already exists` });
		} else {
			const result = await prisma.departments.update({
				where: {
					DeptID: parseInt(id),
				},
				data: {
					DeptName: deptName,
					DeptDesc: deptDesc,
				},
			});
			if (result) {
				res.json({ message: `Department successfully updated` });
			}
		}
	} catch (error) {
		res.json({ error: `Failed to update department` });
	}
});

// delete a dept by deptID - DONE
router.delete("/delete_id/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const result = await prisma.departments.delete({
			where: {
				DeptID: parseInt(id),
			},
		});

		if (result) {
			res.json({ message: `Department successfully deleted` });
		}
	} catch (error) {
		res.json({ error: `Failed to delete department` });
	}
});

router.delete("/delete_name/:deptname", async (req, res) => {
	const { deptname } = req.params;
	try {
		const result = await prisma.departments.delete({
			where: {
				DeptName: deptname,
			},
		});

		if (result) {
			res.json({ message: `Department successfully deleted` });
		}
	} catch (error) {
		res.json({ error: `Failed to delete department` });
	}
});

module.exports = router;

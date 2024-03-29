const prisma = require("../../config/init").prisma;
const express = require("express");
const router = express.Router();

// get all jobs - DONE
router.get("/all", async (req, res) => {
  try {
    const jobs = await prisma.jobs.findMany({
      include: {
        SkillsRequired: {
          where: {
            SkillStatus: true,
          },
        },
      },
    });
    if (jobs.length > 0) {
      res.json(jobs);
    } else {
      res.json({ error: `There is no jobs in the database` });
    }
  } catch (error) {
    res.json(error.meta);
  }
});

router.get("/allactive", async (req, res) => {
	try {
		const jobs = await prisma.jobs.findMany({
      where: {
        JobStatus: true,
      },
			include: {
				SkillsRequired: {
					where: {
						SkillStatus: true,
					},
				},
			},
		});
		if (jobs.length > 0) {
			res.json(jobs);
		} else {
			res.json({ error: `There is no jobs in the database` });
		}
	} catch (error) {
		res.json(error.meta);
	}
});

// get all skills of job by jobid - DONE
router.get("/search/:jobid/skills", async (req, res) => {
  const { jobid } = req.params;
  try {
    if (jobid == ":jobid" || jobid == null) {
      res.json({ error: `Please fill in a jobid` });
    } else {
      const result = await prisma.jobs.findUnique({
        where: {
          JobID: parseInt(jobid),
        },
        include: {
          SkillsRequired: true,
        },
      });
      if (result) {
        if (result.SkillsRequired.length > 0) {
          res.json(result.SkillsRequired);
        } else {
          res.json({ error: `Job ${jobid} has no skills` });
        }
      } else {
        res.json({ error: `Job ${jobid} not found` });
      }
    }
  } catch (error) {
    console.log(error);
    res.json(error.meta);
  }
});

// add new job - DONE
router.post("/add", async (req, res) => {
  try {
    const { jobName, jobDesc, jobDeptId, jobSkills } = req.body;
    if (jobName.length == 0 || jobDesc.length == 0 || jobDeptId.length == 0) {
      res.json({ error: `Please fill in all fields` });
    } else {
      const jobNameDuplicate = await prisma.jobs.findFirst({
        where: {
          JobName: jobName,
        },
      });

      if (jobNameDuplicate) {
        res.json({ error: `Job ${jobName} already exists` });
      } else {
        if (jobSkills.length > 0) {
          await prisma.jobs.create({
            data: {
              JobName: jobName,
              JobDesc: jobDesc,
              Dept: {
                connect: { DeptID: parseInt(jobDeptId) },
              },
              SkillsRequired: {
                connect: jobSkills.map((skill) => ({
                  SkillID: parseInt(skill),
                })),
              },
            },
          });
        } else {
          await prisma.jobs.create({
            data: {
              JobName: jobName,
              JobDesc: jobDesc,
              Dept: {
                connect: { DeptID: parseInt(jobDeptId) },
              },
            },
          });
        }
        res.json({ success: `Job: ${jobName} added` });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed to add job" });
  }
});

// add skills to job by jobid (Must be existing skills) - DONE
router.put("/editJobDetails/:jobid", async (req, res) => {
  const { jobid } = req.params;
  var itemsToEdit = req.body;
  var skillsToAdd = itemsToEdit.skillsToAdd;
  var jobName = itemsToEdit.nameChange;
  var jobDesc = itemsToEdit.descChange;
  var skillsIDtoRemove = itemsToEdit.skillsToRemove;

  try {
    // pass in skillsArr as an array of skillIDs
    if (jobid == ":jobid" || jobid == null || jobid == undefined) {
      res.json({ error: "Please provide the required fields" });
    } else if (!Array.isArray(skillsToAdd)) {
      res.json({ error: "Please provide an array of skill IDs" });
    } else {
      const jobIdFound = await prisma.jobs.findUnique({
        where: {
          JobID: parseInt(jobid),
        },
      });
      if (jobIdFound) {
        let skillsIdNotFound = [];
        for (let skillId of skillsToAdd) {
          const skillFound = await prisma.skills.findFirst({
            where: {
              SkillID: parseInt(skillId),
            },
          });
          if (!skillFound) {
            skillsIdNotFound.push(skillId);
          }
        }

        if (skillsIdNotFound.length > 0) {
          res.json({ error: `Skills with ID ${skillsIdNotFound} not found` });
        } else {
          let skillsIdAlrExists = [];
          for (let skillId of skillsToAdd) {
            skillsIdAlrExists.push({ SkillID: skillId });
          }
          let skillsToRemove = [];
          for (let eachID of skillsIDtoRemove) {
            skillsToRemove.push({ SkillID: eachID });
          }
          const result = await prisma.jobs.update({
            where: {
              JobID: parseInt(jobid),
            },
            data: {
              JobName: jobName,
              JobDesc: jobDesc,
              SkillsRequired: {
                connect: skillsIdAlrExists,
                disconnect: skillsToRemove,
              },
            },
          });
          if (result) {
            res.json({ message: `Successfully updated Job details` });
          } else {
            res.json({ error: `Failed to update Job with an ID of ${jobid}` });
          }
        }
      } else {
        res.json({ error: `Job with JobID ${jobid} does not exist` });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "An Error occured while updating Job" });
  }
});

// activate & deactivate job by jobid
router.put("/toggle-id/:jobid", async (req, res) => {
  const { jobid } = req.params;
  try {
    if (
      jobid == ":jobid" ||
      jobid.length == 0 ||
      jobid == undefined ||
      jobid == null
    ) {
      res.json({ error: "Please provide the required fields" });
    } else {
      const jobIdFound = await prisma.jobs.findUnique({
        where: {
          JobID: parseInt(jobid),
        },
      });
      if (jobIdFound) {
        const result = await prisma.jobs.update({
          where: {
            JobID: parseInt(jobid),
          },
          data: {
            JobStatus: !jobIdFound.JobStatus,
          },
        });
        if (result) {
          res.json({ message: `Job with JobID ${jobid} has changed status` });
        } else {
          res.json({ error: `Failed to update job status with JobID ${jobid}` });
        }
      } else {
        res.json({ error: `Job with JobID ${jobid} does not exist` });
      }
    }
  } catch (error) {
    res.json({ error: "Failed to update job status" });
  }
});

// soft delete job by jobname
router.put("/delete-name/:jobname", async (req, res) => {
  const { jobname } = req.params;
  try {
    if (jobname == ":jobname" || jobname.length == 0 || jobname == undefined) {
      res.json({ error: "Please provide the required fields" });
    } else {
      const jobNameFound = await prisma.jobs.findUnique({
        where: {
          JobName: jobname,
        },
      });
      if (jobNameFound) {
        const result = await prisma.jobs.update({
          where: {
            JobName: jobname,
          },
          data: {
            JobStatus: false,
          },
        });
        if (result) {
          res.json({ message: `Job with JobName ${jobname} deleted` });
        } else {
          res.json({ error: `Failed to delete job with JobName ${jobname}` });
        }
      } else {
        res.json({ error: `Job with JobName ${jobname} does not exist` });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed to delete job" });
  }
});

// hard delete job by jobname
router.delete("/hard-delete-name/:jobname", async (req, res) => {
  const { jobname } = req.params;
  try {
    if (jobname == ":jobname" || jobname.length == 0 || jobname == undefined) {
      res.json({ error: "Please provide the required fields" });
    } else {
      const jobNameFound = await prisma.jobs.findUnique({
        where: {
          JobName: jobname,
        },
      });
      if (jobNameFound) {
        const result = await prisma.jobs.delete({
          where: {
            JobName: jobname,
          },
        });
        if (result) {
          res.json({ message: `Job with JobName ${jobname} deleted` });
        } else {
          res.json({ error: `Failed to delete job with JobName ${jobname}` });
        }
      } else {
        res.json({ error: `Job with JobName ${jobname} does not exist` });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ error: "Failed to delete job" });
  }
});

module.exports = router;

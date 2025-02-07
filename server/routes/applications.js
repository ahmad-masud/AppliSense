const express = require("express");
const router = express.Router();
const {
  getApplications,
  getApplication,
  createApplication,
  createApplications,
  deleteApplications,
  deleteApplication,
  updateApplication,
} = require("../controllers/applicationController");
const requireAuth = require("../middleware/requireAuth");

router.use(requireAuth);

router.get("/", getApplications);

router.get("/:id", getApplication);

router.post("/create", createApplication);

router.post("/createMultiple", createApplications);

router.delete("/deleteMultiple", deleteApplications);

router.delete("/delete/:id", deleteApplication);

router.patch("/update/:id", updateApplication);

module.exports = router;

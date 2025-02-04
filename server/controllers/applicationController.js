const Application = require("../models/Application");
const mongoose = require("mongoose");

const getApplications = async (req, res) => {
  const user_id = req.user._id;

  try {
    const applications = await Application.find({ user_id }).sort({
      createdAt: -1,
    });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getApplication = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  try {
    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createApplication = async (req, res) => {
  const {
    company,
    position,
    jobType,
    location,
    status,
    dateApplied,
    jobPostingURL,
    applicationSource,
    workType,
    notes,
  } = req.body;

  if (!company || !position || !status || !dateApplied) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields" });
  }

  try {
    const user_id = req.user._id;
    const application = await Application.create({
      user_id,
      company,
      position,
      jobType,
      location,
      status,
      dateApplied,
      jobPostingURL,
      applicationSource,
      workType,
      notes,
    });

    res.status(201).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createApplications = async (req, res) => {
  const applications = req.body.applications;

  if (!Array.isArray(applications) || applications.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of applications" });
  }

  try {
    const user_id = req.user._id;

    const applicationsWithUser = applications.map((app) => ({
      user_id,
      ...app,
    }));

    for (let app of applicationsWithUser) {
      if (
        !app.company ||
        !app.position ||
        !app.jobType ||
        !app.location ||
        !app.status ||
        !app.dateApplied
      ) {
        return res
          .status(400)
          .json({ error: "All applications must have required fields" });
      }
    }

    const createdApplications =
      await Application.insertMany(applicationsWithUser);

    res.status(201).json(createdApplications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  try {
    const application = await Application.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid application ID" });
  }

  try {
    const application = await Application.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  createApplications,
  deleteApplication,
  updateApplication,
};

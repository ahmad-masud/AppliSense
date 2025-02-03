const Application = require("../models/Application");
const mongoose = require("mongoose");

const getApplications = async (req, res) => {
  const user_id = req.user._id;

  try {
    const applications = await Application.find({ user_id }).sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getApplication = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }
  const application = await Application.findById(id);
  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }
  res.status(200).json(application);
};

const createApplication = async (req, res) => {
  const { title, description, date } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "Please provide a title and date" });
  }

  try {
    const user_id = req.user._id;
    const application = await Application.create({
      title,
      description,
      date,
      user_id,
    });
    res.status(200).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteApplication = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const application = await Application.findByIdAndDelete(id);

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.status(200).json({ message: "Application deleted" });
};

const updateApplication = async (req, res) => {
  const { id } = req.params;
  const { title, description, date } = req.body;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  const application = await Application.findByIdAndUpdate(
    id,
    { title, description, date },
    { new: true }
  );

  if (!application) {
    return res.status(404).json({ error: "Application not found" });
  }

  res.status(200).json(application);
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  deleteApplication,
  updateApplication,
};

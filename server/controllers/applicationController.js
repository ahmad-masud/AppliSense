const Application = require("../models/Application");
const mongoose = require("mongoose");

const getApplications = async (req, res) => {
  const user_id = req.user._id;
  const {
    search,
    jobType,
    status,
    workType,
    applicationSource,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  try {
    let query = { user_id };

    if (jobType) query.jobType = jobType;
    if (status) query.status = status;
    if (workType) query.workType = workType;
    if (applicationSource) query.applicationSource = applicationSource;

    if (search) {
      query.$or = [
        { company: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { dateApplied: -1 };
    if (sort === "date-asc") sortOptions = { dateApplied: 1 };
    if (sort === "date-desc") sortOptions = { dateApplied: -1 };
    if (sort === "company-asc") sortOptions = { company: 1 };
    if (sort === "company-desc") sortOptions = { company: -1 };
    if (sort === "position-asc") sortOptions = { position: 1 };
    if (sort === "position-desc") sortOptions = { position: -1 };
    if (sort === "location-asc") sortOptions = { location: 1 };
    if (sort === "location-desc") sortOptions = { location: -1 };
    if (sort === "jobType-asc") sortOptions = { jobType: 1 };
    if (sort === "jobType-desc") sortOptions = { jobType: -1 };
    if (sort === "status-asc") sortOptions = { status: 1 };
    if (sort === "status-desc") sortOptions = { status: -1 };
    if (sort === "source-asc") sortOptions = { applicationSource: 1 };
    if (sort === "source-desc") sortOptions = { applicationSource: -1 };
    if (sort === "workType-asc") sortOptions = { workType: 1 };
    if (sort === "workType-desc") sortOptions = { workType: -1 };

    const pageNumber = parseInt(page);
    const pageLimit = parseInt(limit);
    const skip = (pageNumber - 1) * pageLimit;

    const applications = await Application.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageLimit);

    const totalApplications = await Application.countDocuments(query);

    res.status(200).json({
      applications,
      totalResults: totalApplications,
      totalPages: Math.ceil(totalApplications / pageLimit),
      currentPage: pageNumber,
      limit: pageLimit,
    });
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

const getApplicationStats = async (req, res) => {
  const user_id = req.user._id;

  try {
    const stats = await Application.aggregate([
      { $match: { user_id } },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: 1 },
          companyCounts: { $push: "$company" },
          positionCounts: { $push: "$position" },
          locationCounts: { $push: "$location" },
          statusCounts: { $push: "$status" },
          jobTypeCounts: { $push: "$jobType" },
          workTypeCounts: { $push: "$workType" },
          sourceCounts: { $push: "$applicationSource" },
        },
      },
    ]);

    if (stats.length === 0) {
      return res
        .status(200)
        .json({ message: "No applications found", stats: {} });
    }

    const formatCounts = (items) =>
      items.reduce((acc, item) => {
        if (!item) return acc;
        acc[item] = (acc[item] || 0) + 1;
        return acc;
      }, {});

    const responseStats = {
      totalApplications: stats[0].totalApplications,
      companyData: formatCounts(stats[0].companyCounts),
      positionData: formatCounts(stats[0].positionCounts),
      locationData: formatCounts(stats[0].locationCounts),
      statusData: formatCounts(stats[0].statusCounts),
      jobTypeData: formatCounts(stats[0].jobTypeCounts),
      workTypeData: formatCounts(stats[0].workTypeCounts),
      sourceData: formatCounts(stats[0].sourceCounts),
    };

    res.status(200).json(responseStats);
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

const deleteApplications = async (req, res) => {
  const { ids } = req.body;

  if (!Array.isArray(ids) || ids.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of application IDs" });
  }

  try {
    await Application.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: "Applications deleted successfully" });
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
  getApplicationStats,
  createApplication,
  createApplications,
  deleteApplications,
  deleteApplication,
  updateApplication,
};

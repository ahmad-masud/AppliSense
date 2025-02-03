const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    dateApplied: {
      type: Date,
      required: true,
      default: Date.now,
    },
    location: {
      type: String,
      trim: true,
      required: true,
    },
    jobType: {
      type: String,
      enum: [
        "Full-Time",
        "Part-Time",
        "Contract",
        "Internship",
        "Co-op",
        "Apprenticeship",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
      required: true,
    },
    jobPostingURL: {
      type: String,
      trim: true,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      default: null,
    },
    applicationSource: {
      type: String,
      enum: [
        "LinkedIn",
        "Indeed",
        "Glassdoor",
        "ZipRecruiter",
        "Monster",
        "AngelList",
        "Hired",
        "CareerBuilder",
        "SimplyHired",
        "Snagajob",
        "Dice (Tech Jobs)",
        "Stack Overflow Jobs",
        "GitHub Jobs",
        "Direct Company Website",
        "Employee Referral",
        "Networking Event",
        "Career Fair",
        "Freelance Platform",
        "University Internship Portal",
        "Government Job Portal",
        "Other",
      ],
    },
    workType: {
      type: String,
      enum: ["Remote", "On-Site", "Hybrid"],
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

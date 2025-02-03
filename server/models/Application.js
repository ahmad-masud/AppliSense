const mongoose = require("mongoose");
const applicationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    date: {
      type: Date,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    user_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);

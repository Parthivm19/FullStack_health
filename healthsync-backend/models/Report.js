const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  filename: {
    type: String,
    required: true,
  },

  parameters: {
    type: Object,
    default: {},
  },

  analysis: {
    type: Object,
    default: {},
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);

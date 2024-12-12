const mongoose = require("mongoose");

const packageSchema = mongoose.Schema({
  membershipId: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  packageAvailed: {
    type: String,
    required: true,
    trim: true,
  },
  packagePrice: {
    type: Number,
    required: true,
  },
  earnPoints: {
    type: Number,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Package", packageSchema);
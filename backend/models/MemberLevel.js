const mongoose = require("mongoose");

const memberLevelSchema = mongoose.Schema({
  membershipName: {
    type: String,
    required: true,
  },
  membershipLevel: {
    type: Number,
    required: true,
    default: 0,
  },
  requirementsAmount: {
    type: Number,
    required: true,
  },
  benefits: {
    type: String, 
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MemberLevel", memberLevelSchema);
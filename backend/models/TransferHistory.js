// FILE: models/TransferHistory.js
const mongoose = require("mongoose");

const transferHistorySchema = mongoose.Schema({
  fromMembershipId: {
    type: String,
    required: true,
  },
  toMembershipId: {
    type: String,
    required: true,
  },
  pointsTransferred: {
    type: Number,
    required: true,
  },
  dateTransferred: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("TransferHistory", transferHistorySchema);
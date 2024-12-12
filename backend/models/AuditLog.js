const mongoose = require("mongoose");

const auditLogSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  metadata: {
    type: Object,
    default: {},
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);

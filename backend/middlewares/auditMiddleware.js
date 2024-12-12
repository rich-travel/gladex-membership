const AuditLog = require("../models/AuditLog");

const auditMiddleware = (action, metadata = {}) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.membershipId; // Extract membershipId from req.user
      if (!userId) {
        console.warn("Audit log skipped: No membershipId provided.");
        return next(); // Skip logging if no membershipId is found
      }

      // Create an audit log entry
      await AuditLog.create({
        userId,
        action,
        timestamp: new Date(),
        metadata: {
          ...metadata,
          requestBody: req.body,
          requestParams: req.params,
        },
      });

      console.info(`Audit log created for action: ${action}, user: ${userId}`);
    } catch (error) {
      console.error("Error creating audit log:", error);
    }

    next(); // Continue to the next middleware or route handler
  };
};

module.exports = auditMiddleware;

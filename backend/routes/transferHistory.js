const express = require("express");
const router = express.Router();
const {
  transferPoints,
  getAllTransferHistory,
  getTransferHistory,
} = require("../controllers/transferHistory");

// Route to transfer points
router.post("/transfer-points", transferPoints);

// Route to get all transfer history
router.get("/transfer-history", getAllTransferHistory);

// Route to get transfer history of a specific user
router.get("/:membershipId", getTransferHistory);

module.exports = router;

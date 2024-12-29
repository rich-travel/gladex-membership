const express = require("express");
const router = express.Router();
const {
  addMembershipLevelToUser,
  getAllMembershipLevels,
  getMembershipLevelById,
  editMembershipLevel,
} = require("../controllers/membershipLevel");

// Route to add a membership level to a user
router.post("/add", addMembershipLevelToUser);

// Route to get all membership levels
router.get("/all", getAllMembershipLevels);

// Route to get a specific membership level by ID
router.get("/:id", getMembershipLevelById);

// Route to edit a membership level by ID
router.put("/edit/:id", editMembershipLevel);

module.exports = router;

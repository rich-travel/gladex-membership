const MemberLevel = require("../models/MemberLevel");
const User = require("../models/User");

// Function to add a membership level to a user
const addMembershipLevelToUser = async (req, res) => {
  const { membershipName, membershipLevel, requirementsAmount, benefits } =
    req.body;

  if (!membershipLevel) {
    return res.status(400).json({ message: "Membership level is required." });
  }

  try {
    // Create a new membership level
    const newMemberLevel = new MemberLevel({
      membershipName,
      membershipLevel,
      requirementsAmount,
      benefits,
    });

    // Save the membership level
    await newMemberLevel.save();

    return res.status(201).json({
      message: "Membership level added successfully.",
      newMemberLevel,
    });
  } catch (error) {
    console.error("Error adding membership level:", error);
    return res.status(500).json({
      message: "Server error. Unable to add membership level.",
      error,
    });
  }
};

// Function to get all membership levels
const getAllMembershipLevels = async (req, res) => {
  try {
    const membershipLevels = await MemberLevel.find();
    if (membershipLevels.length === 0) {
      return res.status(200).json({ message: "No membership levels found." });
    }
    return res.status(200).json({
      message: "Membership levels retrieved successfully.",
      membershipLevels,
    });
  } catch (error) {
    console.error("Error retrieving membership levels:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve membership levels.",
      error,
    });
  }
};

// Function to get a specific membership level by ID
const getMembershipLevelById = async (req, res) => {
  const { id } = req.params;

  try {
    const membershipLevel = await MemberLevel.findById(id);

    if (!membershipLevel) {
      return res.status(404).json({ message: "Membership level not found." });
    }

    return res.status(200).json({
      message: "Membership level retrieved successfully.",
      membershipLevel,
    });
  } catch (error) {
    console.error("Error retrieving membership level:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve membership level.",
      error,
    });
  }
};

module.exports = {
  addMembershipLevelToUser,
  getAllMembershipLevels,
  getMembershipLevelById,
};

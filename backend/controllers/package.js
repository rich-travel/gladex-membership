const Package = require("../models/Package");
const User = require("../models/User");
const MemberLevel = require("../models/MemberLevel");

const addPackageToUser = async (req, res) => {
  try {
    const { membershipId, packageAvailed, packagePrice } = req.body;

    // Find the user by membershipId
    const user = await User.findOne({ membershipId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the basePoints based on the user's membershipLevel
    const memberLevel = await MemberLevel.findOne({
      membershipLevel: user.membershipLevel,
    });
    
    if (!memberLevel) {
      console.error(
        `Membership level ${user.membershipLevel} not found for user ${membershipId}`
      );
      return res.status(404).json({ message: "Membership level not found" });
    }

    const basePoints = memberLevel.basePoints;

    // Calculate earnPoints
    const earnPoints = Math.floor(Number(packagePrice) / Number(basePoints));

    // Create a new package
    const newPackage = new Package({
      membershipId,
      fullName: `${user.firstName} ${user.lastName}`,
      packageAvailed,
      packagePrice: Number(packagePrice),
      earnPoints,
    });

    // Save the package
    await newPackage.save();

    // Update user's points and money
    user.points += earnPoints;
    user.money += Number(packagePrice); // Ensure packagePrice is added as a number
    await user.save();

    res.status(201).json({ message: "Package added successfully", newPackage });
  } catch (error) {
    console.error("Error adding package to user:", error);
    res.status(500).json({ message: error.message });
  }
};

const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json({ packages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPackagesByUser = async (req, res) => {
  const { membershipId } = req.params;

  if (!membershipId) {
    return res.status(400).json({ message: "Membership ID is required." });
  }

  try {
    // Find the packages by membershipId
    const packages = await Package.find({ membershipId });

    if (packages.length === 0) {
      return res.status(200).json({ message: "No packages found." });
    }

    return res
      .status(200)
      .json({ message: "Packages retrieved successfully.", packages });
  } catch (error) {
    console.error("Error retrieving packages:", error);
    return res
      .status(500)
      .json({ message: "Server error. Unable to retrieve packages.", error });
  }
};

module.exports = {
  addPackageToUser,
  getAllPackages,
  getPackagesByUser,
};

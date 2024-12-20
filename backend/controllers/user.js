const User = require("../models/User");
const MemberLevel = require("../models/MemberLevel");
const bcrypt = require("bcrypt");
const { generateToken } = require("../auth");

// Function to check if an email already exists in the database
const checkEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ exists: true, message: "Email already exists." });
    }
    return res
      .status(200)
      .json({ exists: false, message: "Email is available." });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

// Generate membership ID
const generateMembershipId = async () => {
  let isUnique = false;
  let membershipId = "";

  while (!isUnique) {
    // Generate a random 12-digit number
    membershipId = Math.floor(Math.random() * 1e12)
      .toString()
      .padStart(12, "0"); // Ensure it's 12 digits with leading zeros

    // Check for uniqueness in the database
    const existingUser = await User.findOne({ membershipId });
    if (!existingUser) {
      isUnique = true;
    }
  }

  return membershipId;
};

// Function to log in a user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate JWT token using the helper function
    const token = generateToken({
      _id: user._id,
      membershipId: user.membershipId,
      isAdmin: user.isAdmin,
    });
    console.log("token", token);
    return res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        membershipId: user.membershipId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        points: user.points,
        money: user.money,
        membershipLevel: user.membershipLevel,
        userProfile: user.userProfile,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred.", error });
  }
};

// Function to register a User
const registerUser = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      password,
      isAdmin,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !mobileNumber || !password) {
      return res.status(400).send({ message: "Required fields are missing." });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: "Email is already registered." });
    }

    // Generate a unique membership ID
    const membershipId = await generateMembershipId();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      membershipId,
      firstName,
      middleName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
      isAdmin,
    });

    // Save the user to the database
    await newUser.save();
    return res.status(201).send({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Server error. Please try again." });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ message: "Logged out successfully." });
};

const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, "-password"); // Exclude password for security

    // Map the users into an array of simplified objects
    const userArray = users.map((user) => ({
      membershipId: user.membershipId,
      firstName: user.firstName,
      middleName: user.middleName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isAdmin: user.isAdmin,
      packages: user.packages,
    }));

    return res.status(200).json({
      message: "Users retrieved successfully.",
      users: userArray,
    });
  } catch (error) {
    console.error("Error retrieving users:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve users.",
      error,
    });
  }
};

const getUserInfo = async (req, res) => {
  const { membershipId } = req.params;

  if (!membershipId) {
    return res.status(400).json({ message: "Membership ID is required." });
  }

  try {
    // Find the user by membershipId
    const user = await User.findOne({ membershipId }, "-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: "User retrieved successfully.",
      user: {
        membershipId: user.membershipId,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        isAdmin: user.isAdmin,
        packages: user.packages,
        points: user.points,
        money: user.money,
        membershipLevel: user.membershipLevel,
        userProfile: user.userProfile,
      },
    });
  } catch (error) {
    console.error("Error retrieving user:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve user.",
      error,
    });
  }
};

const updateUserAdmin = async (req, res) => {
  const { membershipId } = req.params;

  if (!membershipId) {
    return res.status(400).json({ message: "Membership ID is required." });
  }

  try {
    // Find the user by membershipId
    const user = await User.findOne({ membershipId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "User is already an admin." });
    }

    // Update user to admin
    user.isAdmin = true;
    await user.save();

    return res.status(200).json({
      message: "User updated to admin successfully.",
      user: {
        membershipId: user.membershipId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    });
  } catch (error) {
    console.error("Error updating user to admin:", error);
    return res.status(500).json({
      message: "Server error. Unable to update user to admin.",
      error,
    });
  }
};

const editUserProfile = async (req, res) => {
  const { membershipId } = req.params;
  const { userProfile } = req.body;

  if (!membershipId) {
    return res.status(400).json({ message: "Membership ID is required." });
  }

  // if (typeof userProfile !== 'number') {
  //   return res.status(400).json({ message: "userProfile must be a number." });
  // }

  try {
    // Find the user by membershipId
    const user = await User.findOne({ membershipId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the userProfile field
    user.userProfile = userProfile;
    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully.",
      user: {
        membershipId: user.membershipId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        userProfile: user.userProfile,
        membershipLevel: user.membershipLevel,
      },
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res.status(500).json({
      message: "Server error. Unable to update user profile.",
      error,
    });
  }
};

const getUserMembershipLevel = async (req, res) => {
  const { membershipId } = req.params;

  try {
    // Find the user by membershipId
    const user = await User.findOne({ membershipId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find all membership levels
    const membershipLevels = await MemberLevel.find().sort({
      requirementsAmount: -1,
    });

    // Determine the user's membership level based on their money
    let userMembershipLevel = null;
    for (const level of membershipLevels) {
      if (user.money >= level.requirementsAmount) {
        userMembershipLevel = level;
        user.membershipLevel = userMembershipLevel.membershipLevel;
        await user.save();
        break;
      }
    }

    if (!userMembershipLevel) {
      return res.status(200).json({
        message: "User does not meet the requirements for any membership level.",
      });
    }

    return res.status(200).json({
      message: "You are now a member of this level",
      membershipLevel: userMembershipLevel,
    });
  } catch (error) {
    console.error("Error retrieving user membership level:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve user membership level.",
      error,
    });
  }
};

module.exports = {
  checkEmail,
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserAdmin,
  getUserInfo,
  editUserProfile,
  getUserMembershipLevel,
};

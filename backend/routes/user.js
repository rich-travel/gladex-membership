const express = require("express");
const userController = require("../controllers/user");
const router = express.Router();
const { verifyAdmin } = require("../auth");
const auditMiddleware = require("../middlewares/auditMiddleware");

const {
  checkEmail,
  registerUser,
  loginUser,
  logoutUser,
  getAllUsers,
  updateUserAdmin,
  getUserInfo,
  editUserProfile,
} = userController;

// Route to check if an email exists
router.post(
  "/checkEmail",
  auditMiddleware("CHECK_EMAIL"), // Log the action
  checkEmail
);

// Route to register a user
router.post(
  "/register",
  auditMiddleware("REGISTER_USER"), // Log the action
  registerUser
);

// Route to login a user
router.post(
  "/login",
  auditMiddleware("LOGIN_USER"), // Log the action
  loginUser
);

// Route to logout a user
router.post(
  "/logout",
  auditMiddleware("LOGOUT_USER"), // Log the action
  logoutUser
);

// Route to get all users (only for admins)
router.get(
  "/all-users",
  verifyAdmin, // Middleware to verify if user is admin
  auditMiddleware("GET_ALL_USERS"), // Log the action
  getAllUsers
);

router.get(
  "/:membershipId",
  auditMiddleware("GET_USER_INFO", (req) => ({
    targetUserId: req.params.membershipId,
    performedBy: req.user.membershipId,
  })),
  getUserInfo
);

// Route to update a user to admin
router.put(
  "/:membershipId",
  auditMiddleware("UPDATE_USER_TO_ADMIN", (req) => ({
    targetUserId: req.params.membershipId,
    performedBy: req.user.membershipId,
  })),
  updateUserAdmin
);

router.put(
  "/:membershipId/edit-profile",
  auditMiddleware("EDIT_USER_PROFILE", (req) => ({
    targetUserId: req.params.membershipId,
    performedBy: req.user.membershipId,
  })),
  editUserProfile
);

module.exports = router;

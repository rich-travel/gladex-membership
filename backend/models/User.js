const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  membershipId: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userProfile: {
    type: Number,
    default: 1,
  },
  points: {
    type: Number,
    default: 0,
  },
  money: {
    type: Number,
    default: 0,
  },
  membershipLevel: {
    type: Number,
    default: 0,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);

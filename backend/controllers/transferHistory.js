const User = require("../models/User");
const TransferHistory = require("../models/TransferHistory");
const MemberLevel = require("../models/MemberLevel");

const transferPoints = async (req, res) => {
  const { fromMembershipId, toMembershipId, points } = req.body;

  if (!fromMembershipId || !toMembershipId || !points) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Find the sender and receiver by membershipId
    const sender = await User.findOne({ membershipId: fromMembershipId });
    const receiver = await User.findOne({ membershipId: toMembershipId });

    if (!sender) {
      return res.status(404).json({ message: "Sender not found." });
    }

    if (!receiver) {
      return res.status(404).json({ message: "Receiver not found." });
    }

    if (sender.membershipId === receiver.membershipId) {
      return res.status(400).json({ message: "Cannot transfer points to self." });
    }

    // Find the transfer fee based on the sender's membership level
    const memberLevel = await MemberLevel.findOne({ membershipLevel: sender.membershipLevel });

    if (!memberLevel) {
      return res.status(404).json({ message: "Membership level not found." });
    }

    const transferFee = memberLevel.transferFee;

    if (sender.points < (Number(points) + transferFee)) {
      return res.status(400).json({ message: "Insufficient points." });
    }

    // Transfer points
    sender.points -= (Number(points) + transferFee);
    receiver.points += Number(points);

    // Save the updated users
    await sender.save();
    await receiver.save();

    // Record the transfer in the history
    const transferHistory = new TransferHistory({
      fromMembershipId,
      toMembershipId,
      pointsTransferred: Number(points),
      transferFee: transferFee,
    });

    await transferHistory.save();

    return res.status(200).json({ message: "Points transferred successfully." });
  } catch (error) {
    console.error("Error transferring points:", error);
    return res.status(500).json({ message: "Server error. Unable to transfer points.", error });
  }
};

// Function to get all transfer history
const getAllTransferHistory = async (req, res) => {
  try {
    const history = await TransferHistory.find().sort({ dateTransferred: -1 });
    if (history.length === 0) {
      return res.status(200).json({ message: "No Transfer History found." });
    }

    return res.status(200).json({
      message: "All transfer history retrieved successfully.",
      history,
    });
  } catch (error) {
    console.error("Error retrieving transfer history:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve transfer history.",
      error,
    });
  }
};

// Function to get transfer history of a specific user
const getTransferHistory = async (req, res) => {
  const { membershipId } = req.params;

  if (!membershipId) {
    return res.status(400).json({ message: "Membership ID is required." });
  }

  try {
    const history = await TransferHistory.find({
      $or: [
        { fromMembershipId: membershipId },
        { toMembershipId: membershipId },
      ],
    }).sort({ dateTransferred: -1 });

    if (history.length === 0) {
      return res.status(200).json({ message: "No Transfer History found." });
    }

    // Add full name for each toMembershipId
    const historyWithNames = await Promise.all(
      history.map(async (transfer) => {
        const receiver = await User.findOne({
          membershipId: transfer.toMembershipId,
        });
        if (receiver) {
          transfer = transfer.toObject(); // Convert Mongoose document to plain object
          transfer.toFullName = `${receiver.firstName} ${receiver.lastName}`;
        }
        return transfer;
      })
    );

    return res.status(200).json({
      message: "Transfer history retrieved successfully.",
      history: historyWithNames,
    });
  } catch (error) {
    console.error("Error retrieving transfer history:", error);
    return res.status(500).json({
      message: "Server error. Unable to retrieve transfer history.",
      error,
    });
  }
};

module.exports = {
  transferPoints,
  getAllTransferHistory,
  getTransferHistory,
};

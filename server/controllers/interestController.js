const mongoose = require("mongoose");

const Interest = require("../models/Interest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// SEND INTEREST
const sendInterest = async (req, res) => {
  try {
    const receiverId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        message: "You cannot send interest to yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (
      receiver.accountStatus !== "approved" ||
      receiver.role !== "user"
    ) {
      return res.status(400).json({
        message: "Interest cannot be sent to this user",
      });
    }

    const existingInterest = await Interest.findOne({
      sender: req.user.id,
      receiver: receiverId,
    });

    if (existingInterest) {
      return res.status(400).json({
        message: "Interest already sent",
      });
    }

    const interest = await Interest.create({
      sender: req.user.id,
      receiver: receiverId,
    });

    const notification = await Notification.create({
      user: receiverId,
      sender: req.user.id,
      type: "interest_received",
      message: "You received a new interest request",
      relatedId: interest._id,
    });

    const io = req.app.get("io");

    if (io) {
      io.to(receiverId).emit("newNotification", notification);
    }

    res.status(201).json({
      message: "Interest sent successfully",
      interest,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Interest already sent",
      });
    }

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET SENT INTERESTS
const getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      sender: req.user.id,
    })
      .populate("receiver", "name email role accountStatus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Sent interests fetched successfully",
      count: interests.length,
      interests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET RECEIVED INTERESTS
const getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({
      receiver: req.user.id,
      status: "pending",
    })
      .populate("sender", "name email role accountStatus")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Received interests fetched successfully",
      count: interests.length,
      interests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ACCEPT INTEREST
const acceptInterest = async (req, res) => {
  try {
    const interestId = req.params.interestId;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        message: "Invalid interest ID",
      });
    }

    const interest = await Interest.findOne({
      _id: interestId,
      receiver: req.user.id,
    });

    if (!interest) {
      return res.status(404).json({
        message: "Interest request not found",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        message: `Interest has already been ${interest.status}`,
      });
    }

    interest.status = "accepted";
    await interest.save();

    const notification = await Notification.create({
      user: interest.sender,
      sender: req.user.id,
      type: "interest_accepted",
      message: "Your interest request was accepted",
      relatedId: interest._id,
    });

    const io = req.app.get("io");

    if (io) {
      io.to(interest.sender.toString()).emit(
        "newNotification",
        notification
      );
    }

    res.status(200).json({
      message: "Interest accepted successfully",
      interest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REJECT INTEREST
const rejectInterest = async (req, res) => {
  try {
    const interestId = req.params.interestId;

    if (!mongoose.Types.ObjectId.isValid(interestId)) {
      return res.status(400).json({
        message: "Invalid interest ID",
      });
    }

    const interest = await Interest.findOne({
      _id: interestId,
      receiver: req.user.id,
    });

    if (!interest) {
      return res.status(404).json({
        message: "Interest request not found",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        message: `Interest has already been ${interest.status}`,
      });
    }

    interest.status = "rejected";
    await interest.save();

    const notification = await Notification.create({
      user: interest.sender,
      sender: req.user.id,
      type: "interest_rejected",
      message: "Your interest request was rejected",
      relatedId: interest._id,
    });

    const io = req.app.get("io");

    if (io) {
      io.to(interest.sender.toString()).emit(
        "newNotification",
        notification
      );
    }

    res.status(200).json({
      message: "Interest rejected successfully",
      interest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY MATCHES
const getMyMatches = async (req, res) => {
  try {
    const acceptedInterests = await Interest.find({
      status: "accepted",
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate("sender", "name email")
      .populate("receiver", "name email")
      .sort({ updatedAt: -1 });

    const matches = acceptedInterests.map((interest) => {
      const senderId = interest.sender._id.toString();

      const matchedUser =
        senderId === req.user.id
          ? interest.receiver
          : interest.sender;

      return {
        interestId: interest._id,
        matchedUser,
        matchedAt: interest.updatedAt,
      };
    });

    res.status(200).json({
      message: "Matches fetched successfully",
      count: matches.length,
      matches,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendInterest,
  getSentInterests,
  getReceivedInterests,
  acceptInterest,
  rejectInterest,
  getMyMatches,
};
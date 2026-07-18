const mongoose = require("mongoose");

const Message = require("../models/Message");
const Interest = require("../models/Interest");
const User = require("../models/User");
const Notification = require("../models/Notification");

// CHECK IF USERS ARE MATCHED
const checkMatch = async (userId1, userId2) => {
  return await Interest.findOne({
    status: "accepted",
    $or: [
      {
        sender: userId1,
        receiver: userId2,
      },
      {
        sender: userId2,
        receiver: userId1,
      },
    ],
  });
};

// SEND MESSAGE
const sendMessage = async (req, res) => {
  try {
    const receiverId = req.params.userId;
    const { message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message cannot be empty",
      });
    }

    if (receiverId === req.user.id) {
      return res.status(400).json({
        message: "You cannot message yourself",
      });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (receiver.accountStatus !== "approved") {
      return res.status(403).json({
        message: "You cannot message this user",
      });
    }

    const match = await checkMatch(req.user.id, receiverId);

    if (!match) {
      return res.status(403).json({
        message: "You can only message matched users",
      });
    }

    const newMessage = await Message.create({
      sender: req.user.id,
      receiver: receiverId,
      message: message.trim(),
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name")
      .populate("receiver", "name");

    const notification = await Notification.create({
      user: receiverId,
      sender: req.user.id,
      type: "new_message",
      message: "You received a new message",
      relatedId: newMessage._id,
    });

    const io = req.app.get("io");

    if (io) {
      io.to(receiverId).emit(
        "receiveMessage",
        populatedMessage
      );

      io.to(req.user.id).emit(
        "receiveMessage",
        populatedMessage
      );

      io.to(receiverId).emit(
        "newNotification",
        notification
      );
    }

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET CHAT HISTORY
const getChatHistory = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const match = await checkMatch(
      req.user.id,
      otherUserId
    );

    if (!match) {
      return res.status(403).json({
        message:
          "You can only view chats with matched users",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: req.user.id,
        },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: 1 });

    res.status(200).json({
      message: "Chat history fetched successfully",
      count: messages.length,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY CONVERSATIONS
const getConversations = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        {
          sender: req.user.id,
        },
        {
          receiver: req.user.id,
        },
      ],
    })
      .populate("sender", "name")
      .populate("receiver", "name")
      .sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach((message) => {
      const senderId =
        message.sender._id.toString();

      const otherUser =
        senderId === req.user.id
          ? message.receiver
          : message.sender;

      const otherUserId =
        otherUser._id.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: otherUser,
          lastMessage: message.message,
          lastMessageAt: message.createdAt,
          isRead: message.isRead,
        });
      }
    });

    res.status(200).json({
      message:
        "Conversations fetched successfully",
      count: conversationMap.size,
      conversations: Array.from(
        conversationMap.values()
      ),
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// MARK MESSAGES AS READ
const markMessagesAsRead = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    if (
      !mongoose.Types.ObjectId.isValid(
        otherUserId
      )
    ) {
      return res.status(400).json({
        message: "Invalid user ID",
      });
    }

    const match = await checkMatch(
      req.user.id,
      otherUserId
    );

    if (!match) {
      return res.status(403).json({
        message:
          "You can only update chats with matched users",
      });
    }

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getConversations,
  markMessagesAsRead,
};
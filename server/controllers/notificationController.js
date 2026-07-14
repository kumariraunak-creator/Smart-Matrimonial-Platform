const mongoose = require("mongoose");
const Notification = require("../models/Notification");

// GET MY NOTIFICATIONS
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user.id,
    })
      .populate("sender", "name")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      message: "Notifications fetched successfully",
      count: notifications.length,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// MARK SINGLE NOTIFICATION AS READ
const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndUpdate(
      {
        _id: notificationId,
        user: req.user.id,
      },
      {
        $set: {
          isRead: true,
        },
      },
      {
        new: true,
      }
    );

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// MARK ALL NOTIFICATIONS AS READ
const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user.id,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE SINGLE NOTIFICATION
const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;

    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      return res.status(400).json({
        message: "Invalid notification ID",
      });
    }

    const notification = await Notification.findOneAndDelete({
      _id: notificationId,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({
        message: "Notification not found",
      });
    }

    res.status(200).json({
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};
const User = require("../models/User");
const UserProfile = require("../models/UserProfile");
const Interest = require("../models/Interest");
const Message = require("../models/Message");
const Notification = require("../models/Notification");
const ConsultantProfile = require("../models/ConsultantProfile");
const Booking = require("../models/Booking");

// GET PENDING USERS
const getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      accountStatus: "pending",
    }).select("-password");

    res.status(200).json({
      message: "Pending users fetched successfully",
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// APPROVE USER
const approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.accountStatus = "approved";
    await user.save();

    res.status(200).json({
      message: "User approved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REJECT USER
const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.accountStatus = "rejected";
    await user.save();

    res.status(200).json({
      message: "User rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// SUSPEND USER
const suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.accountStatus = "suspended";
    await user.save();

    res.status(200).json({
      message: "User suspended successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REACTIVATE USER
const reactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.accountStatus = "approved";
    await user.save();

    res.status(200).json({
      message: "User reactivated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET PENDING CONSULTANT PROFILES
const getPendingConsultantProfiles = async (req, res) => {
  try {
    const profiles = await ConsultantProfile.find({
      approvalStatus: "pending",
    })
      .populate(
        "user",
        "name email role accountStatus verificationStatus"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message:
        "Pending consultant profiles fetched successfully",
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// APPROVE CONSULTANT PROFILE
const approveConsultantProfile = async (req, res) => {
  try {
    const profile =
      await ConsultantProfile.findById(
        req.params.profileId
      ).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        message: "Consultant profile not found",
      });
    }

    if (
      !profile.user ||
      ![
        "consultant",
        "service_provider",
      ].includes(profile.user.role)
    ) {
      return res.status(400).json({
        message:
          "Profile does not belong to a consultant or service provider",
      });
    }

    if (
      profile.user.accountStatus !== "approved"
    ) {
      return res.status(400).json({
        message:
          "Consultant user account must be approved first",
      });
    }

    profile.approvalStatus = "approved";

    await profile.save();

    res.status(200).json({
      message:
        "Consultant profile approved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REJECT CONSULTANT PROFILE
const rejectConsultantProfile = async (req, res) => {
  try {
    const profile =
      await ConsultantProfile.findById(
        req.params.profileId
      ).populate("user", "-password");

    if (!profile) {
      return res.status(404).json({
        message: "Consultant profile not found",
      });
    }

    if (
      !profile.user ||
      ![
        "consultant",
        "service_provider",
      ].includes(profile.user.role)
    ) {
      return res.status(400).json({
        message:
          "Profile does not belong to a consultant or service provider",
      });
    }

    profile.approvalStatus = "rejected";

    await profile.save();

    res.status(200).json({
      message:
        "Consultant profile rejected successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET ADMIN DASHBOARD STATISTICS
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers,
      suspendedUsers,

      totalProfiles,

      totalInterests,
      pendingInterests,
      acceptedInterests,
      rejectedInterests,

      totalMessages,

      totalNotifications,
      unreadNotifications,

      totalConsultantProfiles,
      pendingConsultantProfiles,
      approvedConsultantProfiles,
      rejectedConsultantProfiles,

      totalBookings,
      pendingBookings,
      acceptedBookings,
      rejectedBookings,
      cancelledBookings,
      completedBookings,

      recentUsers,
    ] = await Promise.all([
      // USERS
      User.countDocuments(),

      User.countDocuments({
        accountStatus: "pending",
      }),

      User.countDocuments({
        accountStatus: "approved",
      }),

      User.countDocuments({
        accountStatus: "rejected",
      }),

      User.countDocuments({
        accountStatus: "suspended",
      }),

      // USER PROFILES
      UserProfile.countDocuments(),

      // INTERESTS
      Interest.countDocuments(),

      Interest.countDocuments({
        status: "pending",
      }),

      Interest.countDocuments({
        status: "accepted",
      }),

      Interest.countDocuments({
        status: "rejected",
      }),

      // MESSAGES
      Message.countDocuments(),

      // NOTIFICATIONS
      Notification.countDocuments(),

      Notification.countDocuments({
        isRead: false,
      }),

      // CONSULTANT PROFILES
      ConsultantProfile.countDocuments(),

      ConsultantProfile.countDocuments({
        approvalStatus: "pending",
      }),

      ConsultantProfile.countDocuments({
        approvalStatus: "approved",
      }),

      ConsultantProfile.countDocuments({
        approvalStatus: "rejected",
      }),

      // BOOKINGS
      Booking.countDocuments(),

      Booking.countDocuments({
        status: "pending",
      }),

      Booking.countDocuments({
        status: "accepted",
      }),

      Booking.countDocuments({
        status: "rejected",
      }),

      Booking.countDocuments({
        status: "cancelled",
      }),

      Booking.countDocuments({
        status: "completed",
      }),

      // RECENT USERS
      User.find()
        .select("-password")
        .sort({
          createdAt: -1,
        })
        .limit(5),
    ]);

    res.status(200).json({
      message:
        "Dashboard statistics fetched successfully",

      users: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
        suspended: suspendedUsers,
      },

      profiles: {
        total: totalProfiles,
      },

      interests: {
        total: totalInterests,
        pending: pendingInterests,
        accepted: acceptedInterests,
        rejected: rejectedInterests,
      },

      matches: {
        total: acceptedInterests,
      },

      messages: {
        total: totalMessages,
      },

      notifications: {
        total: totalNotifications,
        unread: unreadNotifications,
      },

      consultants: {
        total: totalConsultantProfiles,
        pending: pendingConsultantProfiles,
        approved: approvedConsultantProfiles,
        rejected: rejectedConsultantProfiles,
      },

      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        accepted: acceptedBookings,
        rejected: rejectedBookings,
        cancelled: cancelledBookings,
        completed: completedBookings,
      },

      recentUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,

  getPendingConsultantProfiles,
  approveConsultantProfile,
  rejectConsultantProfile,

  getDashboardStats,
};
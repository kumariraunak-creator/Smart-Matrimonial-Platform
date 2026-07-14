const mongoose = require("mongoose");

const Notification = require("../models/Notification");
const Booking = require("../models/Booking");
const ConsultantProfile = require("../models/ConsultantProfile");
const User = require("../models/User");

// HELPER: CREATE + EMIT NOTIFICATION
const createAndEmitNotification = async ({
  req,
  user,
  sender,
  type,
  message,
  relatedId,
}) => {
  const notification = await Notification.create({
    user,
    sender,
    type,
    message,
    relatedId,
  });

  const io = req.app.get("io");

  if (io) {
    io.to(user.toString()).emit(
      "newNotification",
      notification
    );
  }

  return notification;
};

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    // Only normal matrimonial users can create bookings
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can create bookings",
      });
    }

    const consultantId = req.params.consultantId;
    const { bookingDate, message } = req.body;

    if (!mongoose.Types.ObjectId.isValid(consultantId)) {
      return res.status(400).json({
        message: "Invalid consultant ID",
      });
    }

    if (!bookingDate) {
      return res.status(400).json({
        message: "Booking date is required",
      });
    }

    if (consultantId === req.user.id) {
      return res.status(400).json({
        message: "You cannot book yourself",
      });
    }

    const parsedBookingDate = new Date(bookingDate);

    if (
      Number.isNaN(parsedBookingDate.getTime()) ||
      parsedBookingDate <= new Date()
    ) {
      return res.status(400).json({
        message: "Booking date must be a valid future date",
      });
    }

    // Check consultant account
    const consultant = await User.findOne({
      _id: consultantId,

      role: {
        $in: ["consultant", "service_provider"],
      },

      accountStatus: "approved",
    });

    if (!consultant) {
      return res.status(404).json({
        message: "Consultant not found",
      });
    }

    // Check consultant profile
    const consultantProfile =
      await ConsultantProfile.findOne({
        user: consultantId,
        approvalStatus: "approved",
        isAvailable: true,
      });

    if (!consultantProfile) {
      return res.status(400).json({
        message: "Consultant is not available for booking",
      });
    }

    // Check duplicate booking slot
    const existingBooking = await Booking.findOne({
      consultant: consultantId,
      bookingDate: parsedBookingDate,

      status: {
        $in: ["pending", "accepted"],
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This booking slot is already taken",
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      consultant: consultantId,
      bookingDate: parsedBookingDate,
      message: message?.trim() || "",
    });

    // Notify consultant
    await createAndEmitNotification({
      req,
      user: consultantId,
      sender: req.user.id,
      type: "booking_received",
      message: "You received a new booking request",
      relatedId: booking._id,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY BOOKINGS AS USER
const getMyBookings = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "User access only",
      });
    }

    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate(
        "consultant",
        "name email role accountStatus"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET RECEIVED BOOKINGS AS CONSULTANT
const getReceivedBookings = async (req, res) => {
  try {
    if (
      !["consultant", "service_provider"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Consultant access only",
      });
    }

    const bookings = await Booking.find({
      consultant: req.user.id,
    })
      .populate(
        "user",
        "name email accountStatus"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Received bookings fetched successfully",
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// CANCEL BOOKING BY USER
const cancelBooking = async (req, res) => {
  try {
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can cancel bookings",
      });
    }

    const bookingId = req.params.bookingId;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    if (
      !["pending", "accepted"].includes(
        booking.status
      )
    ) {
      return res.status(400).json({
        message:
          `Booking cannot be cancelled because it is ${booking.status}`,
      });
    }

    booking.status = "cancelled";

    await booking.save();

    // Notify consultant about cancellation
    await createAndEmitNotification({
      req,
      user: booking.consultant,
      sender: req.user.id,
      type: "booking_cancelled",
      message: "A booking has been cancelled by the user",
      relatedId: booking._id,
    });

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE BOOKING STATUS BY CONSULTANT
const updateBookingStatus = async (req, res) => {
  try {
    if (
      !["consultant", "service_provider"].includes(
        req.user.role
      )
    ) {
      return res.status(403).json({
        message: "Consultant access only",
      });
    }

    const bookingId = req.params.bookingId;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        message: "Invalid booking ID",
      });
    }

    const allowedStatuses = [
      "accepted",
      "rejected",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Status must be accepted, rejected, or completed",
      });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      consultant: req.user.id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Valid status transitions
    const validTransitions = {
      pending: ["accepted", "rejected"],
      accepted: ["completed"],
    };

    const allowedNextStatuses =
      validTransitions[booking.status] || [];

    if (!allowedNextStatuses.includes(status)) {
      return res.status(400).json({
        message:
          `Booking cannot change from ${booking.status} to ${status}`,
      });
    }

    booking.status = status;

    await booking.save();

    const notificationMessages = {
      accepted:
        "Your booking request has been accepted",

      rejected:
        "Your booking request has been rejected",

      completed:
        "Your booking has been marked as completed",
    };

    // Notify booking owner
    await createAndEmitNotification({
      req,
      user: booking.user,
      sender: req.user.id,
      type: `booking_${status}`,
      message: notificationMessages[status],
      relatedId: booking._id,
    });

    res.status(200).json({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  cancelBooking,
  updateBookingStatus,
};
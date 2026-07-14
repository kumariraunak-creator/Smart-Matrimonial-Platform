const express = require("express");

const {
  createBooking,
  getMyBookings,
  getReceivedBookings,
  cancelBooking,
  updateBookingStatus,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/consultant/:consultantId",
  protect,
  createBooking
);

router.get(
  "/my",
  protect,
  getMyBookings
);

router.get(
  "/received",
  protect,
  getReceivedBookings
);

router.put(
  "/cancel/:bookingId",
  protect,
  cancelBooking
);

router.put(
  "/status/:bookingId",
  protect,
  updateBookingStatus
);

module.exports = router;
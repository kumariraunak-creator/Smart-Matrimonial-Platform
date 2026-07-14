const express = require("express");

const {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getMyNotifications);

router.put("/read-all", protect, markAllNotificationsAsRead);

router.put(
  "/read/:notificationId",
  protect,
  markNotificationAsRead
);

router.delete(
  "/:notificationId",
  protect,
  deleteNotification
);

module.exports = router;
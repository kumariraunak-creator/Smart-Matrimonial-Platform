const express = require("express");

const {
  sendMessage,
  getChatHistory,
  getConversations,
  markMessagesAsRead,
} = require("../controllers/chatController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/conversations", protect, getConversations);

router.post("/send/:userId", protect, sendMessage);

router.get("/:userId", protect, getChatHistory);

router.put("/read/:userId", protect, markMessagesAsRead);

module.exports = router;
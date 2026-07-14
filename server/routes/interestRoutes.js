const express = require("express");

const {
  sendInterest,
  getSentInterests,
  getReceivedInterests,
  acceptInterest,
  rejectInterest,
  getMyMatches,
} = require("../controllers/interestController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/send/:userId", protect, sendInterest);

router.get("/sent", protect, getSentInterests);

router.get("/received", protect, getReceivedInterests);

router.put("/accept/:interestId", protect, acceptInterest);

router.put("/reject/:interestId", protect, rejectInterest);

router.get("/matches", protect, getMyMatches);

module.exports = router;
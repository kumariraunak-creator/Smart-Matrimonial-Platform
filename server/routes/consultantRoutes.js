const express = require("express");

const {
  createOrUpdateConsultantProfile,
  getMyConsultantProfile,
  browseConsultants,
  getConsultantById,
  updateAvailability,
} = require("../controllers/consultantController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.put("/profile", protect, createOrUpdateConsultantProfile);

router.get("/me", protect, getMyConsultantProfile);

router.get("/browse", protect, browseConsultants);

router.put("/availability", protect, updateAvailability);

router.get("/:id", protect, getConsultantById);

module.exports = router;
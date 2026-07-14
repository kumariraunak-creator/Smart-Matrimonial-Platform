const express = require("express");

const {
  createOrUpdateProfile,
  getMyProfile,
  browseProfiles,
  getProfileById,
  uploadProfilePhoto,
  deleteProfilePhoto,
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.put("/", protect, createOrUpdateProfile);

router.get("/me", protect, getMyProfile);

router.get("/browse", protect, browseProfiles);

router.post(
  "/photo",
  protect,
  upload.single("profilePhoto"),
  uploadProfilePhoto
);

router.delete(
  "/photo",
  protect,
  deleteProfilePhoto
);

router.get("/:id", protect, getProfileById);

module.exports = router;
const express = require("express");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  suspendUser,
  reactivateUser,
  getPendingConsultantProfiles,
  approveConsultantProfile,
  rejectConsultantProfile,
  getDashboardStats,
} = require("../controllers/adminController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

// USER MANAGEMENT
router.get(
  "/pending-users",
  protect,
  adminOnly,
  getPendingUsers
);

router.put(
  "/approve-user/:id",
  protect,
  adminOnly,
  approveUser
);

router.put(
  "/reject-user/:id",
  protect,
  adminOnly,
  rejectUser
);

router.put(
  "/suspend-user/:id",
  protect,
  adminOnly,
  suspendUser
);

router.put(
  "/reactivate-user/:id",
  protect,
  adminOnly,
  reactivateUser
);

// CONSULTANT PROFILE MANAGEMENT
router.get(
  "/pending-consultants",
  protect,
  adminOnly,
  getPendingConsultantProfiles
);

router.put(
  "/approve-consultant/:profileId",
  protect,
  adminOnly,
  approveConsultantProfile
);

router.put(
  "/reject-consultant/:profileId",
  protect,
  adminOnly,
  rejectConsultantProfile
);

// ADMIN DASHBOARD
router.get(
  "/dashboard",
  protect,
  adminOnly,
  getDashboardStats
);

module.exports = router;
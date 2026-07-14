const mongoose = require("mongoose");

const ConsultantProfile = require("../models/ConsultantProfile");
const User = require("../models/User");

// CREATE OR UPDATE CONSULTANT PROFILE
const createOrUpdateConsultantProfile = async (req, res) => {
  try {
    const {
      serviceType,
      specialization,
      experience,
      qualification,
      city,
      bio,
      consultationFee,
    } = req.body;

    if (!["consultant", "service_provider"].includes(req.user.role)) {
      return res.status(403).json({
        message: "Only consultants or service providers can create this profile",
      });
    }

    const profile = await ConsultantProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          serviceType,
          specialization,
          experience,
          qualification,
          city,
          bio,
          consultationFee,
          approvalStatus: "pending",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      message: "Consultant profile saved successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY CONSULTANT PROFILE
const getMyConsultantProfile = async (req, res) => {
  try {
    const profile = await ConsultantProfile.findOne({
      user: req.user.id,
    }).populate("user", "name email role accountStatus");

    if (!profile) {
      return res.status(404).json({
        message: "Consultant profile not found",
      });
    }

    res.status(200).json({
      message: "Consultant profile fetched successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// BROWSE APPROVED CONSULTANTS
const browseConsultants = async (req, res) => {
  try {
    const filter = {
      approvalStatus: "approved",
      isAvailable: true,
    };

    if (req.query.city) {
      filter.city = {
        $regex: req.query.city,
        $options: "i",
      };
    }

    if (req.query.serviceType) {
      filter.serviceType = {
        $regex: req.query.serviceType,
        $options: "i",
      };
    }

    const profiles = await ConsultantProfile.find(filter)
      .populate({
        path: "user",
        match: {
          accountStatus: "approved",
          role: {
            $in: ["consultant", "service_provider"],
          },
        },
        select: "name email role",
      })
      .sort({ createdAt: -1 });

    const validProfiles = profiles.filter(
      (profile) => profile.user
    );

    res.status(200).json({
      message: "Consultants fetched successfully",
      count: validProfiles.length,
      consultants: validProfiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET CONSULTANT BY ID
const getConsultantById = async (req, res) => {
  try {
    const consultantId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(consultantId)) {
      return res.status(400).json({
        message: "Invalid consultant ID",
      });
    }

    const profile = await ConsultantProfile.findOne({
      user: consultantId,
      approvalStatus: "approved",
    }).populate("user", "name email role accountStatus");

    if (
      !profile ||
      !profile.user ||
      profile.user.accountStatus !== "approved"
    ) {
      return res.status(404).json({
        message: "Consultant not found",
      });
    }

    res.status(200).json({
      message: "Consultant fetched successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE AVAILABILITY
const updateAvailability = async (req, res) => {
  try {
    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      return res.status(400).json({
        message: "isAvailable must be true or false",
      });
    }

    const profile = await ConsultantProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          isAvailable,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        message: "Consultant profile not found",
      });
    }

    res.status(200).json({
      message: "Availability updated successfully",
      isAvailable: profile.isAvailable,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateConsultantProfile,
  getMyConsultantProfile,
  browseConsultants,
  getConsultantById,
  updateAvailability,
};
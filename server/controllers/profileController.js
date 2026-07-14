const UserProfile = require("../models/UserProfile");
const cloudinary = require("../config/cloudinary");

// HELPER: UPLOAD BUFFER TO CLOUDINARY
const uploadBufferToCloudinary = (fileBuffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "smart-matrimonial/profiles",
        public_id: `profile-${userId}`,
        overwrite: true,
        resource_type: "image",
        transformation: [
          {
            width: 800,
            height: 800,
            crop: "limit",
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// CREATE OR UPDATE MY PROFILE
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      city,
      education,
      profession,
      bio,
      partnerPreferences,
    } = req.body;

    let profile = await UserProfile.findOne({
      user: req.user.id,
    });

    if (profile) {
      profile = await UserProfile.findOneAndUpdate(
        {
          user: req.user.id,
        },
        {
          age,
          gender,
          city,
          education,
          profession,
          bio,
          partnerPreferences,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        profile,
      });
    }

    profile = await UserProfile.create({
      user: req.user.id,
      age,
      gender,
      city,
      education,
      profession,
      bio,
      partnerPreferences,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET MY PROFILE
const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// BROWSE + SEARCH + FILTER PROFILES
const browseProfiles = async (req, res) => {
  try {
    const {
      gender,
      city,
      education,
      profession,
      minAge,
      maxAge,
    } = req.query;

    const filter = {
      user: {
        $ne: req.user.id,
      },
    };

    if (gender) {
      filter.gender = gender;
    }

    if (city) {
      filter.city = {
        $regex: city,
        $options: "i",
      };
    }

    if (education) {
      filter.education = {
        $regex: education,
        $options: "i",
      };
    }

    if (profession) {
      filter.profession = {
        $regex: profession,
        $options: "i",
      };
    }

    if (minAge || maxAge) {
      filter.age = {};

      if (minAge) {
        filter.age.$gte = Number(minAge);
      }

      if (maxAge) {
        filter.age.$lte = Number(maxAge);
      }
    }

    const profiles = await UserProfile.find(filter);

    res.status(200).json({
      message: "Profiles fetched successfully",
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

// GET SINGLE PROFILE
const getProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.findById(
      req.params.id
    );

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPLOAD OR UPDATE PROFILE PHOTO
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Profile photo is required",
      });
    }

    const profile = await UserProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message:
          "Create your profile before uploading a photo",
      });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      req.user.id
    );

    profile.profilePhoto = result.secure_url;

    await profile.save();

    res.status(200).json({
      message:
        "Profile photo uploaded successfully",
      profilePhoto: profile.profilePhoto,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE PROFILE PHOTO
const deleteProfilePhoto = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    });

    if (!profile) {
      return res.status(404).json({
        message: "Profile not found",
      });
    }

    if (!profile.profilePhoto) {
      return res.status(400).json({
        message: "Profile photo not found",
      });
    }

    await cloudinary.uploader.destroy(
      `smart-matrimonial/profiles/profile-${req.user.id}`,
      {
        resource_type: "image",
        invalidate: true,
      }
    );

    profile.profilePhoto = null;

    await profile.save();

    res.status(200).json({
      message:
        "Profile photo deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  browseProfiles,
  getProfileById,
  uploadProfilePhoto,
  deleteProfilePhoto,
};
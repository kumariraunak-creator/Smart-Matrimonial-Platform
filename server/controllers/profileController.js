const UserProfile = require("../models/UserProfile");
const cloudinary = require("../config/cloudinary");

// ==========================
// CLOUDINARY HELPER
// ==========================
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
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

// ==========================
// CREATE OR UPDATE PROFILE
// ==========================
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
      profile.age = age;
      profile.gender = gender;
      profile.city = city;
      profile.education = education;
      profile.profession = profession;
      profile.bio = bio;
      profile.partnerPreferences = partnerPreferences;
      profile.profileCompleted = true;

      await profile.save();

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
      profileCompleted: true,
    });

    res.status(201).json({
      message: "Profile created successfully",
      profile,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// GET MY PROFILE
// ==========================
const getMyProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      user: req.user.id,
    }).populate("user", "name email");

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
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// BROWSE PROFILES
// ==========================
const browseProfiles = async (req, res) => {
  console.log("✅ browseProfiles route hit");
  console.log("Logged in User:", req.user);

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
      profileCompleted: true,
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

    const profiles = await UserProfile.find(filter).populate({
      path: "user",
      match: {
        accountStatus: "approved",
      },
      select: "name email role accountStatus",
    });

    const approvedProfiles = profiles.filter(
      (profile) => profile.user !== null
    );

    res.status(200).json({
      message: "Profiles fetched successfully",
      count: approvedProfiles.length,
      profiles: approvedProfiles,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
// ==========================
// GET SINGLE PROFILE
// ==========================
const getProfileById = async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id).populate(
      "user",
      "name email role"
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
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// UPLOAD PROFILE PHOTO
// ==========================
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
        message: "Please create your profile first",
      });
    }

    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      req.user.id
    );

    profile.profilePhoto = result.secure_url;

    await profile.save();

    res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: profile.profilePhoto,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// DELETE PROFILE PHOTO
// ==========================
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

    if (profile.profilePhoto) {
      await cloudinary.uploader.destroy(
        `smart-matrimonial/profiles/profile-${req.user.id}`,
        {
          resource_type: "image",
          invalidate: true,
        }
      );
    }

    profile.profilePhoto = null;

    await profile.save();

    res.status(200).json({
      message: "Profile photo deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==========================
// EXPORTS
// ==========================
module.exports = {
  createOrUpdateProfile,
  getMyProfile,
  browseProfiles,
  getProfileById,
  uploadProfilePhoto,
  deleteProfilePhoto,
};
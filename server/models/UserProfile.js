const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },

    city: {
      type: String,
      required: true,
    },

    education: {
      type: String,
      required: true,
    },

    profession: {
      type: String,
      required: true,
    },

    bio: {
      type: String,
      default: "",
    },

    profilePhoto: {
  type: String,
  default: null,
},
    partnerPreferences: {
      minAge: Number,
      maxAge: Number,
      preferredCity: String,
      preferredEducation: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserProfile", userProfileSchema);
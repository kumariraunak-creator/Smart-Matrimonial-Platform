const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "consultant", "service_provider", "admin"],
      default: "user",
    },

    accountStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },

    verificationStatus: {
      type: String,
      enum: ["unverified", "under_review", "verified"],
      default: "unverified",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
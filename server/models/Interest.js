const mongoose = require("mongoose");

const interestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Same sender receiver ko duplicate interest nahi bhej sakta
interestSchema.index(
  {
    sender: 1,
    receiver: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Interest", interestSchema);
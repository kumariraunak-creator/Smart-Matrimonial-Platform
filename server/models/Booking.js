const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({
  consultant: 1,
  bookingDate: 1,
});

module.exports = mongoose.model("Booking", bookingSchema);
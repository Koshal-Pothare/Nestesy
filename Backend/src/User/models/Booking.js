const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    propertyId: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
      default: 0,
    },

    bathrooms: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      default: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    host: {
      type: String,
      default: "",
    },

    hostPhone: {
      type: String,
      default: "",
    },

    visitDate: {
      type: String,
      required: true,
    },

    visitTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },

    bookedAt: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
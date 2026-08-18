const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    propertyId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: [
        true,
        "Please provide a review title",
      ],
    },

    description: {
      type: String,
      required: [
        true,
        "Please provide a review description",
      ],
      minlength: [
        10,
        "Review must be at least 10 characters",
      ],
    },

    rating: {
      type: Number,
      required: [
        true,
        "Please provide a rating",
      ],
      min: [
        1,
        "Rating must be at least 1",
      ],
      max: [
        5,
        "Rating cannot be more than 5",
      ],
    },

    cleanliness: {
      type: Number,
      min: 1,
      max: 5,
    },

    communication: {
      type: Number,
      min: 1,
      max: 5,
    },

    accuracy: {
      type: Number,
      min: 1,
      max: 5,
    },

    checkIn: {
      type: Number,
      min: 1,
      max: 5,
    },

    value: {
      type: Number,
      min: 1,
      max: 5,
    },

    verifiedBooking: {
      type: Boolean,
      default: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index(
  {
    tenant: 1,
    propertyId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Review",
  reviewSchema
);
const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
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
      default: 0,
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

    description: {
      type: String,
      default: "",
    },

    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index(
  {
    tenant: 1,
    propertyId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Favorite", favoriteSchema);
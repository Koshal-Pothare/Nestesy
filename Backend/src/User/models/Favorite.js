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
    },

    title: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    bedrooms: {
      type: Number,
    },

    bathrooms: {
      type: Number,
    },

    area: {
      type: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    description: {
      type: String,
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

module.exports = mongoose.model(
  "Favorite",
  favoriteSchema
);
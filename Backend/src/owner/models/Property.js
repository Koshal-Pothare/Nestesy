const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },

    type: { type: String, default: "" },
    propertyType: {
      type: String,
      enum: [
        "Apartment",
        "Villa",
        "Independent House",
        "PG",
        "Studio",
        "Flat",
        "Penthouse",
        "House",
        "Duplex",
        "Farmhouse",
      ],
      required: true,
    },

    bhk: { type: Number, required: true },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, required: true },
    kitchens: { type: Number, default: 0 },

    area: { type: Number, required: true },
    squareFeet: { type: Number, default: 0 },

    rent: { type: Number, required: true },
    price: { type: Number, default: 0 },
    monthlyRent: { type: Number, default: 0 },

    deposit: { type: Number, required: true },
    securityDeposit: { type: Number, default: 0 },
    maintenance: { type: Number, default: 0 },

    furnished: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Semi Furnished", "Fully Furnished", "Unfurnished", ""],
      default: "Unfurnished",
    },
    furnishing: { type: String, default: "" },

    tenantPreference: {
      type: String,
      enum: ["Family", "Bachelor", "Any", ""],
      default: "Any",
    },

    idealFor: { type: [String], default: [] },
    amenities: { type: [String], default: [] },

    images: { type: [String], default: [] },
    outerImages: { type: [String], default: [] },
    livingRoomImages: { type: [String], default: [] },
    bathroomImages: { type: [String], default: [] },
    balconyImages: { type: [String], default: [] },
    kitchenImages: { type: [String], default: [] },
    bedroomImages: { type: [String], default: [] },

    location: { type: String, default: "" },
    city: { type: String, default: "" },
    locality: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "India" },
    pincode: { type: String, default: "" },
    address: { type: String, default: "" },

    coordinates: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },

    availability: { type: Boolean, default: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive", "rented"],
      default: "active",
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "active", "inactive", "rented"],
      default: "active",
    },
    statusUpdatedAt: { type: Date, default: null },

    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    favorites: { type: Number, default: 0 },

    verification: {
      ownerName: { type: String, default: "" },
      ownerEmail: { type: String, default: "" },
      ownerPhone: { type: String, default: "" },
      propertyAddress: { type: String, default: "" },
      documents: {
        aadhar: { type: String, default: "" },
        pan: { type: String, default: "" },
        propertyTax: { type: String, default: "" },
        ownershipDeed: { type: String, default: "" },
        utilityBill: { type: String, default: "" },
      },
      additionalNotes: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

propertySchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Property", propertySchema);
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'PG', 'Studio'],
      required: true,
    },
    bhk: {
      type: Number,
      required: true,
    },
    bathrooms: {
      type: Number,
      required: true,
    },
    area: {
      type: Number, // sq ft
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    deposit: {
      type: Number,
      required: true,
    },
    furnished: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Unfurnished'],
      default: 'Unfurnished',
    },
    tenantPreference: {
      type: String,
      enum: ['Family', 'Bachelor', 'Any'],
      default: 'Any',
    },
    amenities: {
      type: [String],
      // e.g. ['Parking', 'Pet Friendly', 'Lift', 'Gym', 'Swimming Pool', 'Balcony']
      default: [],
    },
    images: {
      type: [String], // Cloudinary URLs
      default: [],
    },
    city: {
      type: String,
      required: true,
    },
    locality: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    availability: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

propertySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
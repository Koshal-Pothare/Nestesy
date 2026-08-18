const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Apartment', 'Villa', 'Independent House', 'PG', 'Studio', 'Flat', 'Penthouse', 'House', 'Duplex', 'Farmhouse'],
      required: true,
    },
    bhk: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    rent: { type: Number, required: true },
    deposit: { type: Number, required: true },
    
    // FIXED: Added 'Semi Furnished' (with space) and '' to match frontend
    furnished: {
      type: String,
      enum: ['Furnished', 'Semi-Furnished', 'Semi Furnished', 'Fully Furnished', 'Unfurnished', ''],
      default: 'Unfurnished',
    },
    
    // FIXED: Added '' to allow empty strings
    tenantPreference: {
      type: String,
      enum: ['Family', 'Bachelor', 'Any', ''],
      default: 'Any',
    },
    
    amenities: { type: [String], default: [] },
    
    // Image Fields
    images: { type: [String], default: [] },
    outerImages: { type: [String], default: [] },
    livingRoomImages: { type: [String], default: [] },
    bathroomImages: { type: [String], default: [] },
    balconyImages: { type: [String], default: [] },
    kitchenImages: { type: [String], default: [] },
    bedroomImages: { type: [String], default: [] },
    
    // FIXED: Changed required: true to required: false
    city: { type: String, required: false },
    locality: { type: String, required: false },
    address: { type: String, required: false },
    
    // FIXED: Changed required: true to required: false and added default [0, 0]
    coordinates: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: false, default: [0, 0] },
    },
    
    availability: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'active', 'inactive', 'rented'],
      default: 'pending',
    },
    views: { type: Number, default: 0 },
    
    // Verification Schema
    verification: {
      ownerName: { type: String },
      ownerEmail: { type: String },
      ownerPhone: { type: String },
      propertyAddress: { type: String },
      documents: {
        aadhar: { type: String },
        pan: { type: String },
        propertyTax: { type: String },
        ownershipDeed: { type: String },
        utilityBill: { type: String },
      },
      additionalNotes: { type: String },
    }
  },
  { timestamps: true }
);

propertySchema.index({ coordinates: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);
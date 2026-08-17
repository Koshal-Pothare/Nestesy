const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, required: true }, // Apartment, Villa, etc.
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  area: { type: Number, required: true },
  description: { type: String },
  amenities: [{ type: String }],
  
  // Property Status (Admin approval flow)
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'inactive'],
    default: 'pending',
  },
  
  // Images (Cloudinary URLs)
  outerImages: [{ type: String }],
  livingRoomImages: [{ type: String }],
  bathroomImages: [{ type: String }],
  balconyImages: [{ type: String }],
  kitchenImages: [{ type: String }],
  bedroomImages: [[{ type: String }]], // Array of arrays because BHK varies
  
  // Verification Details
  verification: {
    ownerName: { type: String, required: true },
    ownerEmail: { type: String, required: true },
    ownerPhone: { type: String, required: true },
    propertyAddress: { type: String, required: true },
    documents: {
      aadhar: { type: String },
      pan: { type: String },
      propertyTax: { type: String },
      ownershipDeed: { type: String },
      utilityBill: { type: String },
    },
    additionalNotes: { type: String },
    verified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    adminNotes: { type: String },
  },
  
  // Analytics
  views: { type: Number, default: 0 },
  inquiries: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Property', propertySchema);
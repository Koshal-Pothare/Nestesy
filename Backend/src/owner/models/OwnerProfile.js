const mongoose = require('mongoose');

const ownerProfileSchema = new mongoose.Schema({
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Owner', 
    required: true,
    unique: true // One profile per Owner
  },
  profilePicture: { 
    type: String, // Cloudinary URL
    default: 'https://res.cloudinary.com/demo/image/upload/v1599999999/default_avatar.png' 
  },
  alternatePhone: { type: String },
  bio: { type: String, default: '' },
  companyName: { type: String, default: '' },
  
  // Address Details
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' },
  
  // Social Links
  socialLinks: {
    website: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    linkedin: { type: String, default: '' }
  },

  // Verification Status (for KYC/Profile verification if needed)
  isProfileComplete: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('OwnerProfile', ownerProfileSchema);
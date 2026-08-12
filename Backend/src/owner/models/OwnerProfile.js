const mongoose = require('mongoose');

const ownerProfileSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
      unique: true,
    },
    profileImage: {
      type: String, // Cloudinary URL
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    address: {
      type: String,
    },
    city: {
      type: String,
    },
    totalProperties: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OwnerProfile', ownerProfileSchema);

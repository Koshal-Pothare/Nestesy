const mongoose = require('mongoose');

const tenantProfileSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      unique: true,
    },
    profileImage: {
      type: String, // Cloudinary URL
    },
    preferredCity: {
      type: String,
    },
    preferredBudget: {
      type: Number,
    },
    preferredType: {
      type: String,
      enum: ['Family', 'Bachelor', 'Any'],
      default: 'Any',
    },
    address: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TenantProfile', tenantProfileSchema);

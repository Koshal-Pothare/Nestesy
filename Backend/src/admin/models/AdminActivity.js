const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    action: {
      type: String,
      required: true,
      // e.g. 'APPROVE_PROPERTY', 'REJECT_PROPERTY', 'BAN_USER', 'DELETE_REVIEW'
    },
    targetType: {
      type: String,
      enum: ['Property', 'Owner', 'Tenant', 'Booking', 'Review', 'Other'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdminActivity', adminActivitySchema);

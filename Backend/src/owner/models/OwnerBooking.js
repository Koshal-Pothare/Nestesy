const mongoose = require('mongoose');

/**
 * OwnerBooking points at the SAME underlying 'bookings' collection as
 * tenant/models/Booking.js. Keeping a separate model file (rather than
 * importing Booking directly) lets the owner module add host-specific
 * statics/methods (e.g. accept/reject/reschedule) without touching the
 * tenant module.
 */
const ownerBookingSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Owner',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    visitTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'rescheduled'],
      default: 'pending',
    },
    rescheduleReason: {
      type: String,
    },
  },
  { timestamps: true, collection: 'bookings' }
);

module.exports = mongoose.model('OwnerBooking', ownerBookingSchema);

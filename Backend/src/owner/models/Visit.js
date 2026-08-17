const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner', required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  visitorName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  propertyName: { type: String, required: true },
  location: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitTime: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
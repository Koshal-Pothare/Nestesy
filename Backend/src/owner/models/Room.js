const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  property: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Property', 
    required: true 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Owner', 
    required: true 
  },
  roomName: { type: String, required: true }, // e.g., "Master Bedroom", "Kids Room"
  roomType: { 
    type: String, 
    required: true, 
    enum: ['Bedroom', 'Bathroom', 'Living Room', 'Kitchen', 'Balcony', 'Other'] 
  },
  capacity: { type: Number, default: 1 },
  price: { type: Number, default: 0 }, // Optional: if room is rented separately
  description: { type: String },
  images: [{ type: String }], // Array of Cloudinary URLs
  isAvailable: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
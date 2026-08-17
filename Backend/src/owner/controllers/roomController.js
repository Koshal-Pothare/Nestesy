const asyncHandler = require('express-async-handler');
const Room = require('../models/Room');
const Property = require('../models/Property');

// @desc    Create a new room for a property
// @route   POST /api/owners/properties/:propertyId/rooms
// @access  Private/ApprovedOwner
const createRoom = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;
  
  // Verify property exists and belongs to owner
  const property = await Property.findById(propertyId);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to add rooms to this property');
  }

  const { roomName, roomType, capacity, price, description, images } = req.body;

  const room = await Room.create({
    property: propertyId,
    owner: req.user._id,
    roomName,
    roomType,
    capacity,
    price,
    description,
    images
  });

  res.status(201).json(room);
});

// @desc    Get all rooms for a specific property
// @route   GET /api/owners/properties/:propertyId/rooms
// @access  Private/ApprovedOwner
const getRoomsByProperty = asyncHandler(async (req, res) => {
  const { propertyId } = req.params;

  // Verify ownership
  const property = await Property.findById(propertyId);
  if (!property || property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const rooms = await Room.find({ property: propertyId }).sort({ createdAt: 1 });
  res.json(rooms);
});

// @desc    Update a room
// @route   PUT /api/owners/rooms/:id
// @access  Private/ApprovedOwner
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updatedRoom = await Room.findByIdAndUpdate(
    req.params.id, 
    req.body, 
    { new: true, runValidators: true }
  );

  res.json(updatedRoom);
});

// @desc    Delete a room
// @route   DELETE /api/owners/rooms/:id
// @access  Private/ApprovedOwner
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    res.status(404);
    throw new Error('Room not found');
  }

  if (room.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await room.deleteOne();
  res.json({ message: 'Room removed successfully' });
});

module.exports = { 
  createRoom, 
  getRoomsByProperty, 
  updateRoom, 
  deleteRoom 
};
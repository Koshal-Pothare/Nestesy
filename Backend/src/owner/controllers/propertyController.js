const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');

// @desc    Create a new property
// @route   POST /api/owners/properties
// @access  Private/ApprovedOwner
const createProperty = asyncHandler(async (req, res) => {
  const {
    title, location, price, type, bhk, bathrooms, area, description, amenities,
    outerImages, livingRoomImages, bathroomImages, balconyImages, kitchenImages, bedroomImages,
    ownerName, ownerEmail, ownerPhone, propertyAddress, verificationDocs, additionalNotes
  } = req.body;

  const property = await Property.create({
    owner: req.user._id, // From protect middleware
    title, location, price, type, 
    bedrooms: bhk, bathrooms, area, description, amenities,
    outerImages, livingRoomImages, bathroomImages, balconyImages, kitchenImages, bedroomImages,
    verification: {
      ownerName, ownerEmail, ownerPhone, propertyAddress,
      documents: verificationDocs,
      additionalNotes
    },
    status: 'pending' // Requires admin approval
  });

  res.status(201).json(property);
});

// @desc    Get owner properties
// @route   GET /api/owners/properties
// @access  Private/ApprovedOwner
const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(properties);
});

// @desc    Get property by ID
// @route   GET /api/owners/properties/:id
// @access  Private/ApprovedOwner
const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  // Make sure owner owns this property
  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this property');
  }

  res.json(property);
});

// @desc    Delete property
// @route   DELETE /api/owners/properties/:id
// @access  Private/ApprovedOwner
const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await property.deleteOne();
  res.json({ message: 'Property removed' });
});

module.exports = { createProperty, getMyProperties, getPropertyById, deleteProperty };
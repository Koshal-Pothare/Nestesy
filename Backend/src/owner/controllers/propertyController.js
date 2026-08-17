const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');

const createProperty = asyncHandler(async (req, res) => {
  const {
    title, location, price, type, bhk, bathrooms, area, description, amenities,
    outerImages, livingRoomImages, bathroomImages, balconyImages, kitchenImages, bedroomImages,
    ownerName, ownerEmail, ownerPhone, propertyAddress, verificationDocs, additionalNotes
  } = req.body;

  // Combine all images for the main `images` array used in frontend cards
  const allImages = [
    ...(outerImages || []),
    ...(livingRoomImages || []),
    ...(bathroomImages || []),
    ...(balconyImages || []),
    ...(kitchenImages || []),
    ...((bedroomImages || []).flat())
  ];

  const property = await Property.create({
    owner: req.user._id,
    title, location, price, type, 
    bedrooms: bhk, bathrooms, area, description, amenities,
    images: allImages,
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

const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(properties);
});

const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this property');
  }

  res.json(property);
});

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

const updatePropertyStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'Active' or 'Rented'

  const property = await Property.findById(req.params.id);
  if (!property) {
    res.status(404);
    throw new Error('Property not found');
  }

  if (property.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  property.status = status;
  property.statusUpdatedAt = Date.now();
  const updatedProperty = await property.save();
  
  res.json(updatedProperty);
});

module.exports = { 
  createProperty, 
  getMyProperties, 
  getPropertyById, 
  deleteProperty, 
  updatePropertyStatus 
};
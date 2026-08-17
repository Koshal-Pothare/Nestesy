const asyncHandler = require("express-async-handler");
const Property = require("../../owner/models/Property");

const getPublicProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    status: { $in: ["approved", "active", "Active"] },
  })
    .populate("owner", "name email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: properties.length,
    properties,
  });
});

const getPublicPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "owner",
    "name email phone"
  );

  if (!property) {
    res.status(404);
    throw new Error("Property not found");
  }

  const allowedStatuses = ["approved", "active", "Active"];

  if (!allowedStatuses.includes(property.status)) {
    res.status(404);
    throw new Error("Property is not available");
  }

  res.status(200).json({
    success: true,
    property,
  });
});

module.exports = {
  getPublicProperties,
  getPublicPropertyById,
};
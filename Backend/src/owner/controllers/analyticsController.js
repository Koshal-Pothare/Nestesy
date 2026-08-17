const asyncHandler = require("express-async-handler");
const Property = require("../models/Property");

const getOwnerAnalytics = asyncHandler(async (req, res) => {
  const properties = await Property.find({
    owner: req.user._id,
  });

  const totalProperties = properties.length;

  const activeProperties = properties.filter(
    (property) =>
      property.status === "approved" ||
      property.status === "Approved" ||
      property.status === "active" ||
      property.status === "Active"
  ).length;

  const pendingApprovals = properties.filter(
    (property) =>
      property.status === "pending" ||
      property.status === "Pending"
  ).length;

  const rejectedProperties = properties.filter(
    (property) =>
      property.status === "rejected" ||
      property.status === "Rejected"
  ).length;

  const totalViews = properties.reduce(
    (total, property) =>
      total + (Number(property.views) || 0),
    0
  );

  const totalInquiries = properties.reduce(
    (total, property) =>
      total + (Number(property.inquiries) || 0),
    0
  );

  res.status(200).json({
    success: true,
    analytics: {
      totalProperties,
      activeProperties,
      pendingApprovals,
      rejectedProperties,
      totalViews,
      totalInquiries,
    },
    properties,
  });
});

module.exports = {
  getOwnerAnalytics,
};
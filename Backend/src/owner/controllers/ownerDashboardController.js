const asyncHandler = require("express-async-handler");

const Property = require("../models/Property");
const Visit = require("../models/Visit");

const getDashboardStats = asyncHandler(async (req, res) => {
  // Make sure authenticated owner exists
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const ownerId = req.user._id;

  // Get owner's properties
  const properties = await Property.find({
    owner: ownerId,
  }).lean();

  // Get owner's visits/inquiries
  const visits = await Visit.find({
    owner: ownerId,
  }).lean();

  const totalProperties = properties.length;

  const activeListings = properties.filter((property) => {
    const status = String(property.status || "").toLowerCase();

    return (
      status === "active" ||
      status === "approved"
    );
  }).length;

  const pendingApprovals = properties.filter((property) => {
    const status = String(property.status || "").toLowerCase();

    return status === "pending";
  }).length;

  const totalViews = properties.reduce((sum, property) => {
    return sum + Number(property.views || 0);
  }, 0);

  const totalInquiries = visits.length;

  // If your Property model contains price,
  // calculate total earnings safely.
  const totalEarnings = properties.reduce((sum, property) => {
    const price = Number(property.price || 0);

    return sum + (
      Number.isFinite(price) ? price : 0
    );
  }, 0);

  const stats = {
    totalProperties,
    activeListings,
    pendingApprovals,
    totalViews,
    totalInquiries,
    totalEarnings,

    // Keep these available for your dashboard UI/chart.
    rating: 0,
    responseRate: 0,
  };

  res.status(200).json({
    success: true,
    stats,
  });
});

module.exports = {
  getDashboardStats,
};
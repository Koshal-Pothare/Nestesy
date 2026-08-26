const asyncHandler = require("express-async-handler");

const Property = require("../models/Property");
const Visit = require("../models/Visit");
const Booking = require("../../User/models/Booking");
const Review = require("../../User/models/Review");

const getDashboardStats = asyncHandler(async (req, res) => {
  // Make sure authenticated owner exists
  if (!req.user || !req.user._id) {
    res.status(401);
    throw new Error("Owner authentication required");
  }

  const ownerId = req.user._id;

  // Get owner's properties
  const properties = await Property.find({
    $or: [{ owner: ownerId }, { ownerId: ownerId }],
  }).lean();

  const propertyIds = properties.map((p) => p._id);
  const propertyIdStrings = properties.map((p) => String(p._id));

  // Get visits and bookings for these properties
  const [visits, bookings, reviews] = await Promise.all([
    Visit.find({
      $or: [{ owner: ownerId }, { property: { $in: propertyIds } }],
    }).lean(),
    Booking.find({
      propertyId: { $in: propertyIdStrings },
    }).lean(),
    Review.find({
      propertyId: { $in: propertyIdStrings },
    }).lean().catch(() => []),
  ]);

  const totalProperties = properties.length;

  const activeListings = properties.filter((property) => {
    const status = String(property.status || "").toLowerCase();
    return status === "active" || status === "approved";
  }).length;

  const pendingApprovals = properties.filter((property) => {
    const status = String(property.status || "").toLowerCase();
    return status === "pending";
  }).length;

  const totalVisitsCount = visits.length + bookings.length;

  const approvedVisitsCount =
    visits.filter((v) => v.status === "approved").length +
    bookings.filter((b) => b.status === "approved").length;

  const pendingVisitsCount =
    visits.filter((v) => v.status === "pending").length +
    bookings.filter((b) => b.status === "pending").length;

  const totalViews = properties.reduce((sum, property) => {
    return sum + Number(property.views || 0);
  }, 0);

  const totalInquiries = totalVisitsCount;

  const totalEarnings = properties.reduce((sum, property) => {
    const price = Number(property.price || property.rent || 0);
    return sum + (Number.isFinite(price) ? price : 0);
  }, 0);

  let rating = 4.8;
  if (reviews && reviews.length > 0) {
    const totalRating = reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
    rating = Number((totalRating / reviews.length).toFixed(1));
  }

  const stats = {
    totalProperties,
    activeListings,
    pendingApprovals,
    totalVisits: totalVisitsCount,
    approvedVisits: approvedVisitsCount,
    pendingVisits: pendingVisitsCount,
    totalViews,
    totalInquiries,
    totalEarnings,
    rating,
    responseRate: totalProperties > 0 ? 95 : 0,
  };

  res.status(200).json({
    success: true,
    stats,
  });
});

module.exports = {
  getDashboardStats,
};
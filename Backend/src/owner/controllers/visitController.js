const asyncHandler = require("express-async-handler");
const Booking = require("../../User/models/Booking");
const Property = require("../models/Property");
const Visit = require("../models/Visit");

const getOwnerVisits = asyncHandler(async (req, res) => {
  const ownerId = req.user._id;
  const ownerName = req.user.name;

  // 1. Find all properties owned by this owner
  const properties = await Property.find({
    $or: [{ owner: ownerId }, { ownerId: ownerId }],
  })
    .select("_id title location price rent bedrooms bathrooms area images verification")
    .lean();

  const propertyIds = properties.map((p) => String(p._id));
  const propertyObjectIds = properties.map((p) => p._id);

  // 2. Find all bookings matching this owner's properties or host identifier
  const bookings = await Booking.find({
    $or: [
      { host: String(ownerId) },
      { host: ownerName },
      { propertyId: { $in: propertyIds } },
    ],
  })
    .populate("tenant", "name email phone username")
    .sort({ createdAt: -1 })
    .lean();

  // 3. Find any direct visits in the Visit model
  const directVisits = await Visit.find({
    $or: [
      { owner: ownerId },
      { property: { $in: propertyObjectIds } },
    ],
  })
    .populate("property", "title location price rent images")
    .sort({ createdAt: -1 })
    .lean();

  // Normalize visits for the frontend
  const formattedBookings = bookings.map((b) => ({
    _id: b._id,
    id: b._id,
    propertyId: b.propertyId,
    title: b.title,
    propertyName: b.title,
    location: b.location,
    visitDate: b.visitDate,
    visitTime: b.visitTime,
    status: b.status || "pending",
    notes: b.notes || "",
    price: b.price || 0,
    bedrooms: b.bedrooms || 0,
    bathrooms: b.bathrooms || 0,
    area: b.area || 0,
    images: b.images || [],
    tenant: b.tenant || {
      name: "Tenant Visitor",
      email: "",
      phone: "",
    },
    visitorName: b.tenant?.name || "Tenant Visitor",
    email: b.tenant?.email || "",
    phone: b.tenant?.phone || b.hostPhone || "",
    createdAt: b.createdAt,
    type: "booking",
  }));

  const formattedDirectVisits = directVisits.map((v) => ({
    _id: v._id,
    id: v._id,
    propertyId: v.property?._id || v.property,
    title: v.propertyName || v.property?.title || "Property",
    propertyName: v.propertyName || v.property?.title || "Property",
    location: v.location || v.property?.location || "Location",
    visitDate: v.visitDate,
    visitTime: v.visitTime,
    status: v.status || "pending",
    notes: "",
    price: v.property?.price || v.property?.rent || 0,
    images: v.property?.images || [],
    tenant: {
      name: v.visitorName,
      email: v.email,
      phone: v.phone,
    },
    visitorName: v.visitorName,
    email: v.email,
    phone: v.phone,
    createdAt: v.createdAt,
    type: "visit",
  }));

  const allVisits = [...formattedBookings, ...formattedDirectVisits].sort(
    (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  res.status(200).json(allVisits);
});

const updateVisitStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const visitId = req.params.id;

  const allowedStatuses = [
    "pending",
    "approved",
    "rejected",
    "completed",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid booking status");
  }

  // Check Booking model first
  let booking = await Booking.findById(visitId);
  if (booking) {
    booking.status = status;
    await booking.save();
    await booking.populate("tenant", "name email phone");
    return res.status(200).json(booking);
  }

  // Check Visit model
  let visit = await Visit.findById(visitId);
  if (visit) {
    visit.status = status;
    await visit.save();
    return res.status(200).json(visit);
  }

  res.status(404);
  throw new Error("Visit booking not found");
});

module.exports = {
  getOwnerVisits,
  updateVisitStatus,
};
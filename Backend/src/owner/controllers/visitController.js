const asyncHandler = require("express-async-handler");
const Booking = require("../../User/models/Booking");


const getOwnerVisits = asyncHandler(async (req, res) => {
  // Because 'host' in your Booking schema is a String, we must cast req.user._id to String
  const query = { host: String(req.user._id) };

  // If a propertyId is provided in the query params, filter by it
  if (req.query.propertyId) {
    query.propertyId = String(req.query.propertyId);
  }

  const visits = await Booking.find(query)
    .populate("tenant", "name email phone")
    .sort({ createdAt: -1 });

  res.status(200).json(visits);
});


const updateVisitStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

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

  const visit = await Booking.findById(req.params.id);

  if (!visit) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (String(visit.host) !== String(req.user._id)) {
    res.status(403);
    throw new Error("Not authorized");
  }

  visit.status = status;
  const updatedVisit = await visit.save();

  await updatedVisit.populate("tenant", "name email phone");

  res.status(200).json(updatedVisit);
});

module.exports = {
  getOwnerVisits,
  updateVisitStatus,
};
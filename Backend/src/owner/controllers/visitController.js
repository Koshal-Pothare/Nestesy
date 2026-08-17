const asyncHandler = require('express-async-handler');
const Visit = require('../models/Visit');

// @desc    Get all visits for an owner
// @route   GET /api/owners/visits
// @access  Private/ApprovedOwner
const getOwnerVisits = asyncHandler(async (req, res) => {
  const visits = await Visit.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(visits);
});

// @desc    Update visit status (Approve, Reject, Mark Completed)
// @route   PUT /api/owners/visits/:id/status
// @access  Private/ApprovedOwner
const updateVisitStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved', 'rejected', 'completed'
  
  const visit = await Visit.findById(req.params.id);

  if (!visit) {
    res.status(404);
    throw new Error('Visit not found');
  }

  // Ensure owner owns this visit
  if (visit.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  visit.status = status;
  const updatedVisit = await visit.save();
  
  res.json(updatedVisit);
});

module.exports = { getOwnerVisits, updateVisitStatus };
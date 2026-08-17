const asyncHandler = require('express-async-handler');
const Property = require('../models/Property');

// @desc    Get owner dashboard stats
// @route   GET /api/owners/dashboard
// @access  Private/ApprovedOwner
const getDashboardStats = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id });

  const stats = {
    totalProperties: properties.length,
    activeListings: properties.filter(p => p.status === 'approved').length,
    pendingApprovals: properties.filter(p => p.status === 'pending').length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInquiries: properties.reduce((sum, p) => sum + (p.inquiries || 0), 0),
  };

  res.json(stats);
});

module.exports = { getDashboardStats };
import Booking from '../models/Booking.js';
import Favorite from '../models/Favorite.js';
import Review from '../models/Review.js';
import Tenant from '../models/Tenant.js';

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.user._id;

    // Get counts
    const upcomingVisits = await Booking.countDocuments({
      tenant: tenantId,
      status: { $nin: ['cancelled', 'rejected'] },
    });

    const totalBookings = await Booking.countDocuments({
      tenant: tenantId,
    });

    const favoriteCount = await Favorite.countDocuments({
      tenant: tenantId,
    });

    const activeBookings = await Booking.countDocuments({
      tenant: tenantId,
      status: 'approved',
    });

    const reviewsCount = await Review.countDocuments({
      tenant: tenantId,
    });

    res.status(200).json({
      success: true,
      stats: {
        upcomingVisits,
        totalBookings,
        favoriteCount,
        activeBookings,
        reviewsCount,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching dashboard stats',
    });
  }
};

// Get recent bookings
export const getRecentBookings = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const limit = req.query.limit || 5;

    const bookings = await Booking.find({ tenant: tenantId })
      .sort({ bookedAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching recent bookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching recent bookings',
    });
  }
};

// Get booking status summary
export const getBookingStatusSummary = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const pending = await Booking.countDocuments({
      tenant: tenantId,
      status: 'pending',
    });

    const approved = await Booking.countDocuments({
      tenant: tenantId,
      status: 'approved',
    });

    const completed = await Booking.countDocuments({
      tenant: tenantId,
      status: 'completed',
    });

    const rejected = await Booking.countDocuments({
      tenant: tenantId,
      status: 'rejected',
    });

    const cancelled = await Booking.countDocuments({
      tenant: tenantId,
      status: 'cancelled',
    });

    res.status(200).json({
      success: true,
      statusSummary: {
        pending,
        approved,
        completed,
        rejected,
        cancelled,
      },
    });
  } catch (error) {
    console.error('Error fetching booking status summary:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching booking status summary',
    });
  }
};

// Get monthly booking trends
export const getMonthlyTrends = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const trends = await Booking.aggregate([
      {
        $match: { tenant: tenantId },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      trends,
    });
  } catch (error) {
    console.error('Error fetching monthly trends:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching monthly trends',
    });
  }
};

// Get user activity
export const getUserActivity = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const user = await Tenant.findById(tenantId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      activity: {
        name: user.name,
        email: user.email,
        joinedDate: user.createdAt,
        lastUpdated: user.updatedAt,
        profileComplete: !!(
          user.name && user.email && user.phone && user.location
        ),
      },
    });
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching user activity',
    });
  }
};

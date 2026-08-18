import express from 'express';
import {
  getDashboardStats,
  getRecentBookings,
  getBookingStatusSummary,
  getMonthlyTrends,
  getUserActivity,
} from '../controllers/tenantDashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get dashboard stats
router.get('/stats', getDashboardStats);

// Get recent bookings
router.get('/bookings/recent', getRecentBookings);

// Get booking status summary
router.get('/bookings/status-summary', getBookingStatusSummary);

// Get monthly trends
router.get('/trends/monthly', getMonthlyTrends);

// Get user activity
router.get('/activity/user', getUserActivity);

export default router;

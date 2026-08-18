import express from 'express';
import {
  createBooking,
  getBookings,
  getUpcomingVisits,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Create booking
router.post('/', createBooking);

// Get all bookings
router.get('/', getBookings);

// Get upcoming visits
router.get('/upcoming/visits', getUpcomingVisits);

// Get single booking
router.get('/:id', getBookingById);

// Update booking
router.put('/:id', updateBooking);

// Cancel booking
router.patch('/:id/cancel', cancelBooking);

// Delete booking
router.delete('/:id', deleteBooking);

export default router;

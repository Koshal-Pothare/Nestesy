const express = require("express");

const {
  createBooking,
  getBookings,
  getUpcomingVisits,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
} = require("../controllers/bookingController");

const { protect } = require("../../common/middleware/authMiddleware");

const router = express.Router();

// All tenant booking routes require authentication
router.use(protect);

// Create booking
router.post("/", createBooking);

// Get all bookings
router.get("/", getBookings);

// Get upcoming visits
router.get("/upcoming/visits", getUpcomingVisits);

// Get single booking
router.get("/:id", getBookingById);

// Update booking
router.put("/:id", updateBooking);

// Cancel booking
router.patch("/:id/cancel", cancelBooking);

// Delete booking
router.delete("/:id", deleteBooking);

module.exports = router;
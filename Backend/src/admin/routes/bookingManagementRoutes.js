const express = require('express');
const router = express.Router();
const { getBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingManagementController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getBookings);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

module.exports = router;

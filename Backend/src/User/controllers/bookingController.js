import Booking from '../models/Booking.js';

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { propertyId, title, location, price, bedrooms, bathrooms, area, images, host, hostPhone, visitDate, visitTime, notes } = req.body;
    const tenantId = req.user._id;

    // Validation
    if (!propertyId || !title || !location || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Check if booking already exists for same property and date
    const existingBooking = await Booking.findOne({
      tenant: tenantId,
      propertyId,
      visitDate,
      status: { $ne: 'cancelled' },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'You already have a booking for this property on this date',
      });
    }

    const booking = new Booking({
      tenant: tenantId,
      propertyId,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      host,
      hostPhone,
      visitDate,
      visitTime,
      notes,
      status: 'pending',
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while creating booking',
    });
  }
};

// Get all bookings for a tenant
export const getBookings = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { status } = req.query;

    let query = { tenant: tenantId };

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookings = await Booking.find(query).sort({ bookedAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching bookings',
    });
  }
};

// Get upcoming visits
export const getUpcomingVisits = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const bookings = await Booking.find({
      tenant: tenantId,
      status: { $nin: ['cancelled', 'rejected'] },
    })
      .sort({ visitDate: 1, visitTime: 1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error('Error fetching upcoming visits:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching upcoming visits',
    });
  }
};

// Get single booking
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while fetching booking',
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;
    const { visitDate, visitTime, notes, status } = req.body;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (visitDate) booking.visitDate = visitDate;
    if (visitTime) booking.visitTime = visitTime;
    if (notes) booking.notes = notes;
    if (status && ['pending', 'approved', 'completed', 'cancelled'].includes(status)) {
      booking.status = status;
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking updated successfully',
      booking,
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while updating booking',
    });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while cancelling booking',
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOneAndDelete({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'An error occurred while deleting booking',
    });
  }
};

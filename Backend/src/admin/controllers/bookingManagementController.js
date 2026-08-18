const Booking = require('../../User/models/Booking');
const { success, error } = require('../../common/utils/response');

/**
 * @route   GET /api/admin/bookings
 * @desc    Get all bookings with filters, search, and populated property/user info
 * @access  Private (admin)
 */
const getBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;

    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const bookingsDocs = await Booking.find(query)
      .sort({ createdAt: -1 })
      .populate('tenantId', 'name email phone profileImage')
      .populate('ownerId', 'name email phone')
      .populate('propertyId', 'title locality city rent images');

    // Perform search in populated data if search term provided
    let filtered = bookingsDocs;
    if (search) {
      const term = search.toLowerCase();
      filtered = bookingsDocs.filter((b) => {
        const tenantName = b.tenantId ? b.tenantId.name.toLowerCase() : '';
        const tenantEmail = b.tenantId ? b.tenantId.email.toLowerCase() : '';
        const propertyTitle = b.propertyId ? b.propertyId.title.toLowerCase() : '';
        const propertyLocation = b.propertyId ? `${b.propertyId.locality} ${b.propertyId.city}`.toLowerCase() : '';
        return (
          tenantName.includes(term) ||
          tenantEmail.includes(term) ||
          propertyTitle.includes(term) ||
          propertyLocation.includes(term)
        );
      });
    }

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    const formattedBookings = paginated.map((b) => {
      const tenant = b.tenantId || {};
      const owner = b.ownerId || {};
      const property = b.propertyId || {};

      return {
        id: b._id,
        _id: b._id,
        user: tenant.name || 'Anonymous User',
        email: tenant.email || 'N/A',
        phone: tenant.phone || 'N/A',
        property: property.title || 'Property',
        location: property.locality && property.city ? `${property.locality}, ${property.city}` : 'N/A',
        propertyImage: property.images && property.images.length > 0 ? property.images[0] : '',
        hostName: owner.name || 'N/A',
        date: b.visitDate ? new Date(b.visitDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A',
        visitDate: b.visitDate,
        time: b.visitTime || '10:00 AM',
        status: b.status,
        rescheduleReason: b.rescheduleReason || '',
        adminNotes: b.adminNotes || '',
        createdAt: b.createdAt,
      };
    });

    const counts = {
      total: bookingsDocs.length,
      pending: bookingsDocs.filter((b) => b.status === 'pending').length,
      confirmed: bookingsDocs.filter((b) => b.status === 'confirmed' || b.status === 'accepted').length,
      completed: bookingsDocs.filter((b) => b.status === 'completed').length,
      cancelled: bookingsDocs.filter((b) => b.status === 'cancelled' || b.status === 'rejected').length,
    };

    return success(res, 200, 'Bookings fetched successfully', {
      bookings: formattedBookings,
      counts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch bookings');
  }
};

/**
 * @route   PUT /api/admin/bookings/:id/status
 * @desc    Update booking status (pending, confirmed, completed, cancelled, rejected)
 * @access  Private (admin)
 */
const updateBookingStatus = async (req, res) => {
  try {
    const { status, adminNotes, rescheduleReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    if (status) booking.status = status;
    if (adminNotes !== undefined) booking.adminNotes = adminNotes;
    if (rescheduleReason !== undefined) booking.rescheduleReason = rescheduleReason;

    await booking.save();

    return success(res, 200, `Booking status updated to ${booking.status}`, {
      booking: {
        id: booking._id,
        status: booking.status,
        adminNotes: booking.adminNotes,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update booking status');
  }
};

/**
 * @route   DELETE /api/admin/bookings/:id
 * @desc    Delete booking record
 * @access  Private (admin)
 */
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return error(res, 404, 'Booking not found');
    }

    await Booking.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Booking deleted successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to delete booking');
  }
};

module.exports = { getBookings, updateBookingStatus, deleteBooking };

const Booking = require("../models/Booking");
const Property = require("../../owner/models/Property"); // Make sure this path points to your Property model

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      propertyId,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      host,       // Frontend might send this, but we'll fetch it just in case
      hostPhone,
      visitDate,
      visitTime,
      notes,
    } = req.body;

    const tenantId = req.user._id;

    // Validation
    if (!propertyId || !title || !location || !visitDate || !visitTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      tenant: tenantId,
      propertyId,
      visitDate,
      status: { $ne: "cancelled" },
    });

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: "You already have a booking for this property on this date",
      });
    }

    // 🔴 NEW: Fetch the Property to automatically get the Host (Owner) ID
    let finalHost = host;
    let finalHostPhone = hostPhone;

    // If the frontend didn't send the host ID, find it from the Property document
    if (!finalHost && propertyId) {
      const property = await Property.findById(propertyId);
      if (property) {
        // Cast owner ObjectId to String because your Booking schema expects a String for 'host'
        finalHost = String(property.owner);
        finalHostPhone = property.hostPhone || property.phone || "";
      }
    }

    const booking = await Booking.create({
      tenant: tenantId,
      propertyId,
      title,
      location,
      price,
      bedrooms,
      bathrooms,
      area,
      images,
      host: finalHost,           // ✅ Now the Host ID is saved!
      hostPhone: finalHostPhone, 
      visitDate,
      visitTime,
      notes,
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating booking",
    });
  }
};

const getBookings = async (req, res) => {
  try {
    const tenantId = req.user._id;
    const { status } = req.query;

    const query = { tenant: tenantId };

    if (status && status !== "all") {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("tenant", "name email phone")
      .sort({ bookedAt: -1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch bookings",
    });
  }
};

const getUpcomingVisits = async (req, res) => {
  try {
    const tenantId = req.user._id;

    const bookings = await Booking.find({
      tenant: tenantId,
      status: { $nin: ["cancelled", "rejected", "completed"] },
    })
      .populate("tenant", "name email phone")
      .sort({ visitDate: 1, visitTime: 1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Error fetching upcoming visits:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch upcoming visits",
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch booking",
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;
    const { visitDate, visitTime, notes, status } = req.body;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (visitDate) booking.visitDate = visitDate;
    if (visitTime) booking.visitTime = visitTime;
    if (notes !== undefined) booking.notes = notes;
    if (status && ["pending", "approved", "completed", "rejected", "cancelled"].includes(status)) {
      booking.status = status;
    }

    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Error updating booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update booking",
    });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOne({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel booking",
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user._id;

    const booking = await Booking.findOneAndDelete({ _id: id, tenant: tenantId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting booking:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete booking",
    });
  }
};

module.exports = {
  createBooking,
  getBookings,
  getUpcomingVisits,
  getBookingById,
  updateBooking,
  cancelBooking,
  deleteBooking,
};
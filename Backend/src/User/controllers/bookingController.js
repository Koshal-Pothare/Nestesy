const Booking = require("../models/Booking");
const Property = require("../../owner/models/Property");
const Owner = require("../../owner/models/Owner");

const enrichBookingWithHost = async (booking) => {
  const b = booking.toObject ? booking.toObject() : { ...booking };
  
  // If host is empty or looks like a 24-char ObjectId string
  if (!b.host || /^[0-9a-fA-F]{24}$/.test(String(b.host).trim())) {
    let owner = null;
    if (b.host && /^[0-9a-fA-F]{24}$/.test(String(b.host).trim())) {
      owner = await Owner.findById(b.host).select("name phone").lean();
    }
    if (!owner && b.propertyId) {
      const prop = await Property.findById(b.propertyId)
        .populate("owner", "name phone")
        .populate("ownerId", "name phone")
        .lean();
      if (prop) {
        b.host =
          prop.verification?.ownerName ||
          prop.owner?.name ||
          prop.ownerId?.name ||
          prop.ownerName ||
          "Nestesy Host";
        b.hostPhone =
          prop.verification?.ownerPhone ||
          prop.owner?.phone ||
          prop.ownerId?.phone ||
          b.hostPhone ||
          "";
      }
    } else if (owner) {
      b.host = owner.name || "Nestesy Host";
      b.hostPhone = owner.phone || b.hostPhone || "";
    }
  }

  if (!b.host || /^[0-9a-fA-F]{24}$/.test(String(b.host).trim())) {
    b.host = "Nestesy Host";
  }

  return b;
};

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
      host,
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

    let finalHost = host;
    let finalHostPhone = hostPhone;

    // Fetch the Property to get the real Host Name (not raw ID)
    if (propertyId) {
      const property = await Property.findById(propertyId)
        .populate("owner", "name phone")
        .populate("ownerId", "name phone")
        .lean();

      if (property) {
        finalHost =
          property.verification?.ownerName ||
          property.owner?.name ||
          property.ownerId?.name ||
          property.ownerName ||
          host ||
          "Nestesy Host";
        finalHostPhone =
          property.verification?.ownerPhone ||
          property.owner?.phone ||
          property.ownerId?.phone ||
          property.hostPhone ||
          hostPhone ||
          "";
      }
    }

    if (!finalHost || /^[0-9a-fA-F]{24}$/.test(String(finalHost).trim())) {
      finalHost = "Nestesy Host";
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
      host: finalHost,
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

    const rawBookings = await Booking.find(query)
      .populate("tenant", "name email phone")
      .sort({ bookedAt: -1, createdAt: -1 });

    const bookings = await Promise.all(rawBookings.map(enrichBookingWithHost));

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

    const rawBookings = await Booking.find({
      tenant: tenantId,
      status: { $nin: ["cancelled", "rejected", "completed"] },
    })
      .populate("tenant", "name email phone")
      .sort({ visitDate: 1, visitTime: 1 });

    const bookings = await Promise.all(rawBookings.map(enrichBookingWithHost));

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
const Review = require("../models/Review");

// Create a review
const createReview = async (req, res) => {
  try {
    const { propertyId, title, description, rating, cleanliness, communication, accuracy, checkIn, value } = req.body;
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Validation
    if (!propertyId || !title || !description || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      tenant: tenantId,
      propertyId,
    });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this property",
      });
    }

    const review = new Review({
      tenant: tenantId,
      propertyId,
      title,
      description,
      rating,
      cleanliness,
      communication,
      accuracy,
      checkIn,
      value,
      verifiedBooking: true,
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while creating review",
    });
  }
};

// Get all reviews for a property
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ propertyId })
      .populate("tenant", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ propertyId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching property reviews:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching property reviews",
    });
  }
};

// Get user reviews
const getUserReviews = async (req, res) => {
  try {
    const tenantId = req.user?._id;

    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const reviews = await Review.find({ tenant: tenantId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching user reviews",
    });
  }
};

// Get property rating summary
const getPropertyRatingSummary = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const reviews = await Review.aggregate([
      { $match: { propertyId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
          averageCleanliness: { $avg: "$cleanliness" },
          averageCommunication: { $avg: "$communication" },
          averageAccuracy: { $avg: "$accuracy" },
          averageCheckIn: { $avg: "$checkIn" },
          averageValue: { $avg: "$value" },
        },
      },
    ]);

    const summary = reviews.length > 0 ? reviews[0] : {
      averageRating: 0,
      totalReviews: 0,
      averageCleanliness: 0,
      averageCommunication: 0,
      averageAccuracy: 0,
      averageCheckIn: 0,
      averageValue: 0,
    };

    res.status(200).json({
      success: true,
      summary: {
        ...summary,
        averageRating: summary.averageRating ? summary.averageRating.toFixed(1) : 0,
        averageCleanliness: summary.averageCleanliness ? summary.averageCleanliness.toFixed(1) : 0,
        averageCommunication: summary.averageCommunication ? summary.averageCommunication.toFixed(1) : 0,
        averageAccuracy: summary.averageAccuracy ? summary.averageAccuracy.toFixed(1) : 0,
        averageCheckIn: summary.averageCheckIn ? summary.averageCheckIn.toFixed(1) : 0,
        averageValue: summary.averageValue ? summary.averageValue.toFixed(1) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching property rating summary:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while fetching property rating summary",
    });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?._id;
    const { title, description, rating } = req.body;

    const review = await Review.findOne({ _id: id, tenant: tenantId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (title) review.title = title;
    if (description) review.description = description;
    if (rating) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      review.rating = rating;
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while updating review",
    });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.user?._id;

    const review = await Review.findOneAndDelete({ _id: id, tenant: tenantId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting review",
    });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  getUserReviews,
  getPropertyRatingSummary,
  updateReview,
  deleteReview,
};

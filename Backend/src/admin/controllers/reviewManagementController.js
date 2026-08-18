const Review = require('../../User/models/Review');
const { success, error } = require('../../common/utils/response');

/**
 * @route   GET /api/admin/reviews
 * @desc    Get all reviews for content moderation
 * @access  Private (admin)
 */
const getReviews = async (req, res) => {
  try {
    const reviewsDocs = await Review.find()
      .sort({ createdAt: -1 })
      .populate('tenantId', 'name email profileImage')
      .populate('propertyId', 'title city locality images');

    const formattedReviews = reviewsDocs.map((r) => ({
      id: r._id,
      _id: r._id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      tenant: {
        id: r.tenantId ? r.tenantId._id : null,
        name: r.tenantId ? r.tenantId.name : 'Anonymous',
        email: r.tenantId ? r.tenantId.email : 'N/A',
        profileImage: r.tenantId ? r.tenantId.profileImage : '',
      },
      property: {
        id: r.propertyId ? r.propertyId._id : null,
        title: r.propertyId ? r.propertyId.title : 'Deleted Property',
        location: r.propertyId ? `${r.propertyId.locality}, ${r.propertyId.city}` : 'N/A',
      },
    }));

    return success(res, 200, 'Reviews fetched successfully', {
      reviews: formattedReviews,
      total: reviewsDocs.length,
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to fetch reviews');
  }
};

/**
 * @route   DELETE /api/admin/reviews/:id
 * @desc    Delete a review (moderation action)
 * @access  Private (admin)
 */
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return error(res, 404, 'Review not found');
    }

    await Review.findByIdAndDelete(req.params.id);

    return success(res, 200, 'Review deleted successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to delete review');
  }
};

module.exports = { getReviews, deleteReview };

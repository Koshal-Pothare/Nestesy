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
      .populate('tenant', 'name email profileImage');

    const formattedReviews = reviewsDocs.map((r) => ({
      id: r._id,
      _id: r._id,
      rating: r.rating,
      comment: r.description || r.comment || '',
      title: r.title || '',
      createdAt: r.createdAt,
      tenant: {
        id: r.tenant ? r.tenant._id : null,
        name: r.tenant ? r.tenant.name : 'Anonymous',
        email: r.tenant ? r.tenant.email : 'N/A',
        profileImage: r.tenant ? r.tenant.profileImage : '',
      },
      property: {
        id: r.propertyId || null,
        title: 'Property',
        location: 'N/A',
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

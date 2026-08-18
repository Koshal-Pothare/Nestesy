const express = require('express');
const router = express.Router();
const { getReviews, deleteReview } = require('../controllers/reviewManagementController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getReviews);
router.delete('/:id', deleteReview);

module.exports = router;

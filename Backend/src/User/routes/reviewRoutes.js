import express from 'express';
import {
  createReview,
  getPropertyReviews,
  getUserReviews,
  getPropertyRatingSummary,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/property/:propertyId', optionalAuth, getPropertyReviews);
router.get('/rating/summary/:propertyId', optionalAuth, getPropertyRatingSummary);

// Protected routes
router.post('/', protect, createReview);
router.get('/user/all', protect, getUserReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;

import express from 'express';
import {
  addFavorite,
  getFavorites,
  removeFavorite,
  isFavorited,
  getFavoriteCount,
} from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Add to favorites
router.post('/', addFavorite);

// Get all favorites
router.get('/', getFavorites);

// Get favorite count
router.get('/count/all', getFavoriteCount);

// Check if property is favorited
router.get('/check/:propertyId', isFavorited);

// Remove from favorites
router.delete('/:propertyId', removeFavorite);

export default router;

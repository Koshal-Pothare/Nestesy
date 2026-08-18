import express from 'express';
import {
  getProfile,
  updateProfile,
  changePassword,
  getProfileCompletion,
  deleteAccount,
} from '../controllers/tenantProfileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get profile
router.get('/', getProfile);

// Update profile
router.put('/', updateProfile);

// Get profile completion percentage
router.get('/completion/status', getProfileCompletion);

// Change password
router.post('/change-password', changePassword);

// Delete account
router.delete('/account/delete', deleteAccount);

export default router;

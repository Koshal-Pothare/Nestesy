const express = require('express');
const router = express.Router();
const { 
  getOwnerProfile, 
  updateOwnerProfile, 
  changeOwnerPassword 
} = require('../controllers/ownerProfileController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

// Apply authentication middleware
// Note: We use 'protect' so they can view/update profile, 
// and 'requireApprovedOwner' to ensure only approved owners can manage their account
router.use(protect);
router.use(requireApprovedOwner);

router.route('/profile')
  .get(getOwnerProfile)
  .put(updateOwnerProfile);

router.route('/change-password')
  .put(changeOwnerPassword);

module.exports = router;
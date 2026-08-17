const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin, getMe, updateProfile, changePassword } = require('../controllers/adminAuthController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, authorize('admin'), getMe);
router.put('/me', protect, authorize('admin'), updateProfile);
router.put('/change-password', protect, authorize('admin'), changePassword);

module.exports = router;

const express = require('express');
const router = express.Router();

const { registerAdmin, loginAdmin, getMe } = require('../controllers/adminAuthController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/me', protect, authorize('admin'), getMe);

module.exports = router;

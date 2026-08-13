const express = require('express');
const router = express.Router();

const { registerOwner, loginOwner, getMe } = require('../controllers/ownerAuthController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.post('/register', registerOwner);
router.post('/login', loginOwner);
router.get('/me', protect, authorize('owner'), getMe);

module.exports = router;

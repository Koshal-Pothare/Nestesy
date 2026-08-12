const express = require('express');
const router = express.Router();

const { registerTenant, loginTenant, getMe } = require('../controllers/tenantAuthController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.post('/register', registerTenant);
router.post('/login', loginTenant);
router.get('/me', protect, authorize('tenant'), getMe);

module.exports = router;

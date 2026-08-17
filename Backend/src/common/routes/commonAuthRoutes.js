const express = require('express');
const router = express.Router();
const { unifiedLogin, getUnifiedMe } = require('../controllers/commonAuthController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', unifiedLogin);
router.get('/me', protect, getUnifiedMe);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/ownerDashboardController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

router.use(protect, requireApprovedOwner);

router.get('/', getDashboardStats);

module.exports = router;
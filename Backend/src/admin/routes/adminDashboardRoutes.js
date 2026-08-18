const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/adminDashboardController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.get('/stats', protect, authorize('admin'), getDashboardStats);

module.exports = router;

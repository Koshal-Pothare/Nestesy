const express = require('express');
const router = express.Router();
const { getHosts, getHostById, updateHostStatus, deleteHost } = require('../controllers/ownerManagementController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getHosts);
router.get('/:id', getHostById);
router.put('/:id/status', updateHostStatus);
router.delete('/:id', deleteHost);

module.exports = router;

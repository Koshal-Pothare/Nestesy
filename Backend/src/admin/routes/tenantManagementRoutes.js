const express = require('express');
const router = express.Router();
const { getTenants, getTenantById, updateTenantStatus, deleteTenant } = require('../controllers/tenantManagementController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/', getTenants);
router.get('/:id', getTenantById);
router.put('/:id/status', updateTenantStatus);
router.delete('/:id', deleteTenant);

module.exports = router;

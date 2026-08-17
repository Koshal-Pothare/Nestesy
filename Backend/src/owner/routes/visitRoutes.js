const express = require('express');
const router = express.Router();
const { getOwnerVisits, updateVisitStatus } = require('../controllers/visitController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

router.use(protect, requireApprovedOwner);

router.route('/')
  .get(getOwnerVisits);

router.route('/:id/status')
  .put(updateVisitStatus);

module.exports = router;
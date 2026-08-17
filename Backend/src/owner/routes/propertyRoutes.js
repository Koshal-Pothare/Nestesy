const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getMyProperties, 
  getPropertyById, 
  deleteProperty, 
  updatePropertyStatus 
} = require('../controllers/propertyController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

router.use(protect, requireApprovedOwner);

router.route('/')
  .post(createProperty)
  .get(getMyProperties);

router.route('/:id')
  .get(getPropertyById)
  .delete(deleteProperty);

router.route('/:id/status')
  .put(updatePropertyStatus);

module.exports = router;
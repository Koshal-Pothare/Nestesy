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

// IMPORT YOUR MULTTER MIDDLEWARE HERE
const { propertyImageFields } = require('../../common/middleware/uploadMiddleware'); 

router.use(protect, requireApprovedOwner);

// Apply propertyImageFields to the POST route
router.route('/')
  .post(propertyImageFields, createProperty)
  .get(getMyProperties);

router.route('/:id')
  .get(getPropertyById)
  .delete(deleteProperty);

router.route('/:id/status')
  .put(updatePropertyStatus);

module.exports = router;
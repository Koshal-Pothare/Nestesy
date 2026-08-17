const express = require('express');
const router = express.Router();
const { 
  createProperty, 
  getMyProperties, 
  getPropertyById, 
  deleteProperty 
} = require('../controllers/propertyController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

// All routes require the owner to be logged in AND approved
router.use(protect);
router.use(requireApprovedOwner);

router.route('/')
  .post(createProperty)
  .get(getMyProperties);

router.route('/:id')
  .get(getPropertyById)
  .delete(deleteProperty);

module.exports = router;
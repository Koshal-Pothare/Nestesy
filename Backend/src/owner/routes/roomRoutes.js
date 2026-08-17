const express = require('express');
const router = express.Router();
const { 
  createRoom, 
  getRoomsByProperty, 
  updateRoom, 
  deleteRoom 
} = require('../controllers/roomController');
const { protect, requireApprovedOwner } = require('../../common/middleware/authMiddleware');

// All routes require the owner to be logged in AND approved
router.use(protect, requireApprovedOwner);

// Routes tied to a Property ID
router.route('/properties/:propertyId/rooms')
  .post(createRoom)
  .get(getRoomsByProperty);

// Routes tied to a specific Room ID
router.route('/rooms/:id')
  .put(updateRoom)
  .delete(deleteRoom);

module.exports = router;
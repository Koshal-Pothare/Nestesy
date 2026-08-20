const express = require("express");
const {
  createReview,
  getPropertyReviews,
  getUserReviews,
  getPropertyRatingSummary,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { protect } = require("../../common/middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/property/:propertyId", getPropertyReviews);
router.get("/rating/summary/:propertyId", getPropertyRatingSummary);

// Protected routes
router.get("/", protect, getUserReviews);
router.post("/", protect, createReview);
router.get("/user/all", protect, getUserReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

module.exports = router;

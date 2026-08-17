const express = require("express");

const router = express.Router();

const {
  getOwnerAnalytics,
} = require("../controllers/analyticsController");

const {
  protect,
  requireApprovedOwner,
} = require("../../common/middleware/authMiddleware");

router.use(protect, requireApprovedOwner);

router.get("/", getOwnerAnalytics);

module.exports = router;
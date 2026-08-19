const express = require("express");

const router = express.Router();

const {
  getProperties,
  getPropertyById,
  updatePropertyStatus,
  approveProperty,
  rejectProperty,
  deleteProperty,
} = require("../controllers/propertyManagementController");

const {
  protect,
  authorize,
} = require("../../common/middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/", getProperties);

router.get("/:id", getPropertyById);

router.put("/:id/approve", approveProperty);

router.put("/:id/reject", rejectProperty);

router.put("/:id/status", updatePropertyStatus);

router.delete("/:id", deleteProperty);

module.exports = router;
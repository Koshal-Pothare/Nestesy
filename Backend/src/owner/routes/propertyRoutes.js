const express = require("express");
const router = express.Router();
const {
  createProperty,
  getMyProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
} = require("../controllers/propertyController");
const { protect, requireApprovedOwner } = require("../../common/middleware/authMiddleware");
const { propertyImageFields } = require("../../common/middleware/uploadMiddleware");

router.use(protect, requireApprovedOwner);

router.route("/").post(propertyImageFields, createProperty).get(getMyProperties);

router
  .route("/:id")
  .get(getPropertyById)
  .put(propertyImageFields, updateProperty)
  .delete(deleteProperty);

router.route("/:id/status").put(updatePropertyStatus);

module.exports = router;
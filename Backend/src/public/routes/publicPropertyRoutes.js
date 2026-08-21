const express = require("express");

const router = express.Router();

const {
  getPublicProperties,
  getPublicPropertyById,
} = require("../controllers/publicPropertyController");
const {
  createProperty,
  updateProperty,
  deleteProperty,
} = require("../../owner/controllers/propertyController");
const { protect, requireApprovedOwner } = require("../../common/middleware/authMiddleware");
const { propertyImageFields } = require("../../common/middleware/uploadMiddleware");

router.get("/", getPublicProperties);
router.get("/approved", getPublicProperties);
router.post("/", protect, requireApprovedOwner, propertyImageFields, createProperty);
router.get("/:id", getPublicPropertyById);
router.put("/:id", protect, requireApprovedOwner, propertyImageFields, updateProperty);
router.delete("/:id", protect, requireApprovedOwner, deleteProperty);

module.exports = router;
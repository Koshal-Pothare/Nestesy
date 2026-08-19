const express = require("express");

const router = express.Router();

const {
  getPublicProperties,
  getPublicPropertyById,
} = require("../controllers/publicPropertyController");

router.get("/", getPublicProperties);
router.get("/approved", getPublicProperties);
router.get("/:id", getPublicPropertyById);

module.exports = router;
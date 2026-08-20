const express = require("express");
const {
  createContact,
  getContacts,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, authorize("admin"), getContacts);

module.exports = router;

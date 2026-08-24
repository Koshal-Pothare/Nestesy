const express = require("express");
const {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", createContact);
router.get("/", protect, authorize("admin"), getContacts);
router.put("/:id/status", protect, authorize("admin"), updateContactStatus);
router.delete("/:id", protect, authorize("admin"), deleteContact);

module.exports = router;

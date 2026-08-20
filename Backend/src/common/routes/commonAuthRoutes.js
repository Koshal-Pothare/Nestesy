const express = require("express");
const router = express.Router();
const {
  unifiedLogin,
  getUnifiedMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/commonAuthController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", unifiedLogin);
router.get("/me", protect, getUnifiedMe);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;

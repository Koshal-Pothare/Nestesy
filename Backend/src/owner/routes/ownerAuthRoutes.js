const express = require("express");

const router = express.Router();

const {
  registerOwner,
  loginOwner,
  logoutOwner,
} = require("../controllers/ownerAuthController");

const { protect } = require("../../common/middleware/authMiddleware");

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.post("/logout", protect, logoutOwner);

module.exports = router;
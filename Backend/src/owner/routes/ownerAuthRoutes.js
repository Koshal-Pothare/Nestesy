const express = require("express");

const {
  registerOwner,
  loginOwner,
} = require("../controllers/ownerAuthController");

const router = express.Router();

// =====================================
// OWNER AUTH ROUTES
// =====================================

// Register
router.post(
  "/register",
  registerOwner
);

// Login
router.post(
  "/login",
  loginOwner
);

module.exports = router;
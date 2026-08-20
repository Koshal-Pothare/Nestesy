const express = require("express");
const { getMe, updateProfile } = require("../controllers/tenantAuthController");
const { protect } = require("../../common/middleware/authMiddleware");

const router = express.Router();

// All routes protected
router.use(protect);

// GET /api/tenant/profile → returns logged-in tenant profile
router.get("/", getMe);

// PUT /api/tenant/profile → update tenant profile fields
router.put("/", updateProfile);

module.exports = router;

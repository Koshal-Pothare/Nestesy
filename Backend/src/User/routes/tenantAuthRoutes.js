const express = require('express');
const passport = require('passport');
const router = express.Router();

const {
  registerTenant,
  loginTenant,
  getMe,
  updateProfile,
  googleAuthCallback,
  googleAuthFailure,
} = require('../controllers/tenantAuthController');
const { protect, authorize } = require('../../common/middleware/authMiddleware');

router.post('/register', registerTenant);
router.post('/login', loginTenant);
router.get('/me', protect, authorize('tenant'), getMe);
router.put('/me', protect, authorize('tenant'), updateProfile);

// Google OAuth Routes
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/tenant/auth/google/failure',
  }),
  googleAuthCallback
);

router.get('/google/failure', googleAuthFailure);

module.exports = router;

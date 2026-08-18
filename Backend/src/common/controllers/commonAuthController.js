const bcrypt = require('bcryptjs');
const Admin = require('../../admin/models/Admin');
const Owner = require('../../owner/models/Owner');
const Tenant = require('../../User/models/Tenant');
const generateToken = require('../utils/generateToken');
const { success, error } = require('../utils/response');

/**
 * @route   POST /api/auth/login
 * @desc    Unified login endpoint that auto-detects or checks user role across Tenant, Host/Owner, Admin
 * @access  Public
 */
const unifiedLogin = async (req, res) => {
  try {
    const { email, username, login, password, role } = req.body;
    const identifier = (email || username || login || '').toLowerCase().trim();

    if (!identifier || !password) {
      return error(res, 400, 'Email/Username and password are required');
    }

    let user = null;
    let foundRole = null;

    // Search by explicit role if provided
    if (role === 'admin') {
      user = await Admin.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
      if (user) foundRole = 'admin';
    } else if (role === 'owner' || role === 'host') {
      user = await Owner.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
      if (user) foundRole = 'owner';
    } else if (role === 'tenant') {
      user = await Tenant.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
      if (user) foundRole = 'tenant';
    } else {
      // Auto-detect role order: Tenant -> Owner -> Admin
      user = await Tenant.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
      if (user) {
        foundRole = 'tenant';
      } else {
        user = await Owner.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
        if (user) {
          foundRole = 'owner';
        } else {
          user = await Admin.findOne({ $or: [{ email: identifier }, { username: identifier }] }).select('+password');
          if (user) {
            foundRole = 'admin';
          }
        }
      }
    }

    if (!user) {
      return error(res, 401, 'Invalid email/username or password');
    }

    if (user.isActive === false) {
      return error(res, 403, 'Account is deactivated');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email/username or password');
    }

    if (foundRole === 'admin') {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = generateToken(user._id, foundRole);

    const userPayload = {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone || '',
      city: user.city || '',
      profileImage: user.profileImage || '',
      role: foundRole,
      isVerified: user.isVerified || false,
      isActive: user.isActive,
    };

    return success(res, 200, 'Login successful', {
      token,
      user: userPayload,
      [foundRole]: userPayload,
    });
  } catch (err) {
    return error(res, 500, err.message || 'Unified login failed');
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile regardless of role
 * @access  Private
 */
const getUnifiedMe = async (req, res) => {
  return success(res, 200, 'Profile fetched', {
    user: req.user,
    role: req.role,
  });
};

module.exports = { unifiedLogin, getUnifiedMe };

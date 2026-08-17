const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const generateToken = require('../../common/utils/generateToken');
const { success, error } = require('../../common/utils/response');

/**
 * @route   POST /api/admin/auth/register
 * @desc    Register a new admin account
 * @access  Public (in production, protected by ADMIN_SETUP_KEY or admin key)
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password, phone, setupKey, adminKey } = req.body;
    const providedKey = setupKey || adminKey;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    // Protection check for setup key if set in env
    const requiredKey = process.env.ADMIN_SETUP_KEY || 'nestesy-admin-secret';
    if (providedKey && providedKey !== requiredKey) {
      return error(res, 403, 'Invalid setup key');
    }

    const existingEmail = await Admin.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return error(res, 409, 'An admin with this email already exists');
    }

    if (username) {
      const existingUsername = await Admin.findOne({ username: username.toLowerCase() });
      if (existingUsername) {
        return error(res, 409, 'Username is already taken');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      username: username ? username.toLowerCase() : email.split('@')[0].toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    const token = generateToken(admin._id, 'admin');

    return success(res, 201, 'Admin registered successfully', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        phone: admin.phone,
        profileImage: admin.profileImage,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register admin');
  }
};

/**
 * @route   POST /api/admin/auth/login
 * @desc    Log an admin in using email or username
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, username, login, password } = req.body;
    const loginIdentifier = email || username || login;

    if (!loginIdentifier || !password) {
      return error(res, 400, 'Email/Username and password are required');
    }

    const queryTerm = loginIdentifier.toLowerCase();
    const admin = await Admin.findOne({
      $or: [{ email: queryTerm }, { username: queryTerm }],
    }).select('+password');

    if (!admin) {
      return error(res, 401, 'Invalid credentials');
    }

    if (!admin.isActive) {
      return error(res, 403, 'This admin account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid credentials');
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, 'admin');

    return success(res, 200, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        phone: admin.phone,
        profileImage: admin.profileImage,
        role: admin.role,
        isActive: admin.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to log in');
  }
};

/**
 * @route   GET /api/admin/auth/me
 * @desc    Get the currently logged-in admin's profile
 * @access  Private (admin)
 */
const getMe = async (req, res) => {
  return success(res, 200, 'Admin profile fetched', { admin: req.user });
};

/**
 * @route   PUT /api/admin/auth/me
 * @desc    Update current admin's profile
 * @access  Private (admin)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage } = req.body;
    const admin = await Admin.findById(req.user._id);

    if (!admin) return error(res, 404, 'Admin not found');

    if (name) admin.name = name;
    if (phone !== undefined) admin.phone = phone;
    if (profileImage !== undefined) admin.profileImage = profileImage;

    await admin.save();

    return success(res, 200, 'Profile updated successfully', {
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        phone: admin.phone,
        profileImage: admin.profileImage,
        role: admin.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update profile');
  }
};

/**
 * @route   PUT /api/admin/auth/change-password
 * @desc    Change password
 * @access  Private (admin)
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return error(res, 400, 'Current and new password are required');
    }

    const admin = await Admin.findById(req.user._id).select('+password');
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return error(res, 400, 'Incorrect current password');
    }

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    await admin.save();

    return success(res, 200, 'Password changed successfully');
  } catch (err) {
    return error(res, 500, err.message || 'Failed to change password');
  }
};

module.exports = { registerAdmin, loginAdmin, getMe, updateProfile, changePassword };
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const generateToken = require('../../common/utils/generateToken');
const { success, error } = require('../../common/utils/response');

/**
 * @route   POST /api/admin/auth/register
 * @desc    Register a new admin account
 * @access  Public (in production, restrict this behind a super-admin invite/setup key)
 */
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, setupKey } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    // Protects against random users self-registering as admin.
    if (process.env.ADMIN_SETUP_KEY && setupKey !== process.env.ADMIN_SETUP_KEY) {
      return error(res, 403, 'Invalid setup key');
    }

    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return error(res, 409, 'An admin with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = generateToken(admin._id, 'admin');

    return success(res, 201, 'Admin registered successfully', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register admin');
  }
};

/**
 * @route   POST /api/admin/auth/login
 * @desc    Log an admin in
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, 'Email and password are required');
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
    if (!admin) {
      return error(res, 401, 'Invalid email or password');
    }

    if (!admin.isActive) {
      return error(res, 403, 'This admin account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id, 'admin');

    return success(res, 200, 'Login successful', {
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
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

module.exports = { registerAdmin, loginAdmin, getMe };
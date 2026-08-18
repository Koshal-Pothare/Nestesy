const bcrypt = require('bcrypt');
const Owner = require('../models/Owner');
const OwnerProfile = require('../models/OwnerProfile');
const generateToken = require('../../common/utils/generateToken');
const { success, error } = require('../../common/utils/response');

/**
 * @route   POST /api/owner/auth/register
 * @desc    Register a new host/owner account
 * @access  Public
 */
const registerOwner = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    const existingOwner = await Owner.findOne({ email: email.toLowerCase() });
    if (existingOwner) {
      return error(res, 409, 'An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const owner = await Owner.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    // create an empty profile doc alongside the account
    await OwnerProfile.create({ ownerId: owner._id });

    const token = generateToken(owner._id, 'owner');

    return success(res, 201, 'Owner registered successfully', {
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        phone: owner.phone,
        role: owner.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register owner');
  }
};

/**
 * @route   POST /api/owner/auth/login
 * @desc    Log an owner/host in
 * @access  Public
 */
const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, 'Email and password are required');
    }

    const owner = await Owner.findOne({ email: email.toLowerCase() }).select('+password');
    if (!owner) {
      return error(res, 401, 'Invalid email or password');
    }

    if (!owner.isActive) {
      return error(res, 403, 'This account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    const token = generateToken(owner._id, 'owner');

    return success(res, 200, 'Login successful', {
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to log in');
  }
};

/**
 * @route   GET /api/owner/auth/me
 * @desc    Get the currently logged-in owner's profile
 * @access  Private (owner)
 */
const getMe = async (req, res) => {
  return success(res, 200, 'Owner profile fetched', { owner: req.user });
};

module.exports = { registerOwner, loginOwner, getMe };

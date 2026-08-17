const bcrypt = require('bcryptjs');
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
    const { name, username, email, password, phone, city } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    const existingEmail = await Owner.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return error(res, 409, 'An account with this email already exists');
    }

    if (username) {
      const existingUser = await Owner.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return error(res, 409, 'Username is already taken');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const owner = await Owner.create({
      name,
      username: username ? username.toLowerCase() : email.split('@')[0].toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      city: city || '',
    });

    // Create an empty profile document alongside account if model exists
    try {
      if (OwnerProfile) {
        await OwnerProfile.create({ ownerId: owner._id });
      }
    } catch (e) {
      console.warn('OwnerProfile creation notice:', e.message);
    }

    const token = generateToken(owner._id, 'owner');

    return success(res, 201, 'Host registered successfully', {
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        phone: owner.phone,
        city: owner.city,
        profileImage: owner.profileImage,
        role: owner.role,
        isVerified: owner.isVerified,
        isActive: owner.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register host');
  }
};

/**
 * @route   POST /api/owner/auth/login
 * @desc    Log an owner/host in using email or username
 * @access  Public
 */
const loginOwner = async (req, res) => {
  try {
    const { email, username, login, password } = req.body;
    const loginIdentifier = email || username || login;

    if (!loginIdentifier || !password) {
      return error(res, 400, 'Email/Username and password are required');
    }

    const queryTerm = loginIdentifier.toLowerCase();
    const owner = await Owner.findOne({
      $or: [{ email: queryTerm }, { username: queryTerm }],
    }).select('+password');

    if (!owner) {
      return error(res, 401, 'Invalid credentials');
    }

    if (!owner.isActive) {
      return error(res, 403, 'This account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid credentials');
    }

    const token = generateToken(owner._id, 'owner');

    return success(res, 200, 'Login successful', {
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        phone: owner.phone,
        city: owner.city,
        profileImage: owner.profileImage,
        role: owner.role,
        isVerified: owner.isVerified,
        isActive: owner.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to log in');
  }
};

/**
 * @route   GET /api/owner/auth/me
 * @desc    Get the currently logged-in host's profile
 * @access  Private (owner)
 */
const getMe = async (req, res) => {
  return success(res, 200, 'Host profile fetched', { owner: req.user });
};

/**
 * @route   PUT /api/owner/auth/me
 * @desc    Update host profile
 * @access  Private (owner)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, profileImage, bio } = req.body;
    const owner = await Owner.findById(req.user._id);

    if (!owner) return error(res, 404, 'Host profile not found');

    if (name) owner.name = name;
    if (phone !== undefined) owner.phone = phone;
    if (city !== undefined) owner.city = city;
    if (profileImage !== undefined) owner.profileImage = profileImage;
    if (bio !== undefined) owner.bio = bio;

    await owner.save();

    return success(res, 200, 'Profile updated successfully', {
      owner: {
        id: owner._id,
        name: owner.name,
        username: owner.username,
        email: owner.email,
        phone: owner.phone,
        city: owner.city,
        profileImage: owner.profileImage,
        bio: owner.bio,
        role: owner.role,
        isVerified: owner.isVerified,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update profile');
  }
};

module.exports = { registerOwner, loginOwner, getMe, updateProfile };

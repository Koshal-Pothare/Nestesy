const bcrypt = require('bcryptjs');
const Tenant = require('../models/Tenant');
const TenantProfile = require('../models/TenantProfile');
const generateToken = require('../../common/utils/generateToken');
const { success, error } = require('../../common/utils/response');

/**
 * @route   POST /api/tenant/auth/register
 * @desc    Register a new tenant account
 * @access  Public
 */
const registerTenant = async (req, res) => {
  try {
    const { name, username, email, password, phone, city } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    const existingEmail = await Tenant.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return error(res, 409, 'An account with this email already exists');
    }

    if (username) {
      const existingUser = await Tenant.findOne({ username: username.toLowerCase() });
      if (existingUser) {
        return error(res, 409, 'Username is already taken');
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tenant = await Tenant.create({
      name,
      username: username ? username.toLowerCase() : email.split('@')[0].toLowerCase(),
      email: email.toLowerCase(),
      password: hashedPassword,
      phone: phone || '',
      city: city || '',
    });

    try {
      if (TenantProfile) {
        await TenantProfile.create({ tenantId: tenant._id });
      }
    } catch (e) {
      console.warn('TenantProfile creation notice:', e.message);
    }

    const token = generateToken(tenant._id, 'tenant');

    return success(res, 201, 'Tenant registered successfully', {
      token,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        username: tenant.username,
        email: tenant.email,
        phone: tenant.phone,
        city: tenant.city,
        profileImage: tenant.profileImage,
        role: tenant.role,
        isActive: tenant.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register tenant');
  }
};

/**
 * @route   POST /api/tenant/auth/login
 * @desc    Log a tenant in using email or username
 * @access  Public
 */
const loginTenant = async (req, res) => {
  try {
    const { email, username, login, password } = req.body;
    const loginIdentifier = email || username || login;

    if (!loginIdentifier || !password) {
      return error(res, 400, 'Email/Username and password are required');
    }

    const queryTerm = loginIdentifier.toLowerCase();
    const tenant = await Tenant.findOne({
      $or: [{ email: queryTerm }, { username: queryTerm }],
    }).select('+password');

    if (!tenant) {
      return error(res, 401, 'Invalid credentials');
    }

    if (!tenant.isActive) {
      return error(res, 403, 'This account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid credentials');
    }

    const token = generateToken(tenant._id, 'tenant');

    return success(res, 200, 'Login successful', {
      token,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        username: tenant.username,
        email: tenant.email,
        phone: tenant.phone,
        city: tenant.city,
        profileImage: tenant.profileImage,
        role: tenant.role,
        isActive: tenant.isActive,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to log in');
  }
};

/**
 * @route   GET /api/tenant/auth/me
 * @desc    Get the currently logged-in tenant's profile
 * @access  Private (tenant)
 */
const getMe = async (req, res) => {
  return success(res, 200, 'Tenant profile fetched', { tenant: req.user });
};

/**
 * @route   PUT /api/tenant/auth/me
 * @desc    Update tenant profile
 * @access  Private (tenant)
 */
const updateProfile = async (req, res) => {
  try {
    const { name, phone, city, profileImage } = req.body;
    const tenant = await Tenant.findById(req.user._id);

    if (!tenant) return error(res, 404, 'Tenant not found');

    if (name) tenant.name = name;
    if (phone !== undefined) tenant.phone = phone;
    if (city !== undefined) tenant.city = city;
    if (profileImage !== undefined) tenant.profileImage = profileImage;

    await tenant.save();

    return success(res, 200, 'Profile updated successfully', {
      tenant: {
        id: tenant._id,
        name: tenant.name,
        username: tenant.username,
        email: tenant.email,
        phone: tenant.phone,
        city: tenant.city,
        profileImage: tenant.profileImage,
        role: tenant.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to update profile');
  }
};

module.exports = { registerTenant, loginTenant, getMe, updateProfile };

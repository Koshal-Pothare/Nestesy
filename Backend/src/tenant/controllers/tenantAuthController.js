const bcrypt = require('bcrypt');
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
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return error(res, 400, 'Name, email, and password are required');
    }

    const existingTenant = await Tenant.findOne({ email: email.toLowerCase() });
    if (existingTenant) {
      return error(res, 409, 'An account with this email already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tenant = await Tenant.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
    });

    // create an empty profile doc alongside the account
    await TenantProfile.create({ tenantId: tenant._id });

    const token = generateToken(tenant._id, 'tenant');

    return success(res, 201, 'Tenant registered successfully', {
      token,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        phone: tenant.phone,
        role: tenant.role,
      },
    });
  } catch (err) {
    return error(res, 500, err.message || 'Failed to register tenant');
  }
};

/**
 * @route   POST /api/tenant/auth/login
 * @desc    Log a tenant in
 * @access  Public
 */
const loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return error(res, 400, 'Email and password are required');
    }

    const tenant = await Tenant.findOne({ email: email.toLowerCase() }).select('+password');
    if (!tenant) {
      return error(res, 401, 'Invalid email or password');
    }

    if (!tenant.isActive) {
      return error(res, 403, 'This account has been deactivated');
    }

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) {
      return error(res, 401, 'Invalid email or password');
    }

    const token = generateToken(tenant._id, 'tenant');

    return success(res, 200, 'Login successful', {
      token,
      tenant: {
        id: tenant._id,
        name: tenant.name,
        email: tenant.email,
        role: tenant.role,
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

module.exports = { registerTenant, loginTenant, getMe };

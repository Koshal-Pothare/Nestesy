const jwt = require('jsonwebtoken');

const { error } = require('../utils/response');

const Admin = require('../../admin/models/Admin');
const Owner = require('../../owner/models/Owner');
const Tenant = require('../../tenant/models/Tenant');

const modelByRole = {
  admin: Admin,
  owner: Owner,
  tenant: Tenant,
};

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

/**
 * Generic authentication middleware.
 *
 * Verifies:
 * 1. JWT exists
 * 2. JWT is valid
 * 3. Role exists
 * 4. User still exists
 *
 * Adds:
 * req.user
 * req.role
 */
const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      return error(res, 401, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return error(res, 401, 'Invalid authentication token');
    }

    const Model = modelByRole[decoded.role];

    if (!Model) {
      return error(res, 401, 'Invalid role in authentication token');
    }

    const user = await Model.findById(decoded.id).select('-password');

    if (!user) {
      return error(res, 401, 'User account no longer exists');
    }

    req.user = user;
    req.role = decoded.role;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 401, 'Authentication token has expired');
    }

    if (err.name === 'JsonWebTokenError') {
      return error(res, 401, 'Invalid authentication token');
    }

    console.error('Authentication error:', err);

    return error(res, 500, 'Authentication failed');
  }
};

/**
 * Role authorization middleware.
 *
 * Example:
 * authorize('owner')
 * authorize('admin')
 * authorize('admin', 'owner')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.role) {
      return error(res, 401, 'User role not found');
    }

    if (!roles.includes(req.role)) {
      return error(
        res,
        403,
        `Role '${req.role}' is not permitted to access this resource`
      );
    }

    next();
  };
};

/**
 * Owner approval middleware.
 *
 * IMPORTANT:
 * Owner must be approved by admin before accessing
 * owner dashboard/property/room/booking APIs.
 */
const requireApprovedOwner = (req, res, next) => {
  if (req.role !== 'owner') {
    return error(res, 403, 'Owner access required');
  }

  if (req.user.status === 'pending') {
    return error(
      res,
      403,
      'Your account is still awaiting admin approval'
    );
  }

  if (req.user.status === 'rejected') {
    return error(
      res,
      403,
      req.user.rejectionReason
        ? `Your host application was rejected: ${req.user.rejectionReason}`
        : 'Your host application was rejected'
    );
  }

  if (req.user.status === 'suspended') {
    return error(
      res,
      403,
      'Your owner account has been suspended'
    );
  }

  if (req.user.status !== 'approved') {
    return error(
      res,
      403,
      'Your owner account is not approved'
    );
  }

  next();
};

/**
 * Optional admin status middleware.
 */
const requireActiveAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return error(res, 403, 'Admin access required');
  }

  if (req.user.status && req.user.status !== 'active') {
    return error(res, 403, 'Admin account is not active');
  }

  next();
};

module.exports = {
  protect,
  authorize,
  requireApprovedOwner,
  requireActiveAdmin,
};
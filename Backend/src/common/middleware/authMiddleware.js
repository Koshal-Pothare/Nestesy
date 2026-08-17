const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');

const Admin = require('../../admin/models/Admin');
const Owner = require('../../owner/models/Owner');
const Tenant = require('../../User/models/Tenant');

const modelByRole = {
  admin: Admin,
  owner: Owner,
  tenant: Tenant,
};

// Get JWT from Authorization header
const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1];
};

// ======================================================
// GENERIC PROTECT
// ======================================================

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

// ======================================================
// ROLE AUTHORIZATION
// ======================================================

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

// ======================================================
// APPROVED OWNER
// ======================================================

const requireApprovedOwner = (req, res, next) => {
  if (req.role !== 'owner') {
    return error(res, 403, 'Owner access required');
  }

  // Pending
  if (req.user.status === 'pending') {
    return error(
      res,
      403,
      'Your account is still awaiting admin approval'
    );
  }

  // Rejected
  if (req.user.status === 'rejected') {
    return error(
      res,
      403,
      req.user.rejectionReason
        ? `Your host application was rejected: ${req.user.rejectionReason}`
        : 'Your host application was rejected'
    );
  }

  // Suspended
  if (req.user.status === 'suspended') {
    return error(
      res,
      403,
      'Your owner account has been suspended'
    );
  }

  // Inactive
  if (req.user.isActive === false) {
    return error(
      res,
      403,
      'Your owner account is inactive'
    );
  }

  // Approved check
  if (req.user.status !== 'approved') {
    return error(
      res,
      403,
      'Your owner account is not approved'
    );
  }

  next();
};

// ======================================================
// ACTIVE ADMIN
// ======================================================

const requireActiveAdmin = (req, res, next) => {
  if (req.role !== 'admin') {
    return error(res, 403, 'Admin access required');
  }

  if (req.user.isActive === false) {
    return error(res, 403, 'Admin account is inactive');
  }

  next();
};

module.exports = {
  protect,
  authorize,
  requireApprovedOwner,
  requireActiveAdmin,
};
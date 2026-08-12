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

/**
 * Verifies the JWT from the Authorization header and attaches
 * req.user (the document) and req.role to the request.
 */
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return error(res, 401, 'Not authorized, no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const Model = modelByRole[decoded.role];
    if (!Model) {
      return error(res, 401, 'Not authorized, invalid role in token');
    }

    const user = await Model.findById(decoded.id).select('-password');
    if (!user) {
      return error(res, 401, 'Not authorized, user no longer exists');
    }

    req.user = user;
    req.role = decoded.role;
    next();
  } catch (err) {
    return error(res, 401, 'Not authorized, token failed or expired');
  }
};

/**
 * Restricts access to specific roles. Use after `protect`.
 * @param  {...string} roles - e.g. authorize('admin'), authorize('owner', 'admin')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return error(res, 403, `Role '${req.role}' is not permitted to access this resource`);
    }
    next();
  };
};

module.exports = { protect, authorize };
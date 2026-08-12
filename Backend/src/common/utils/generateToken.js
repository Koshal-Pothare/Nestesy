const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT containing the user's id and role.
 * @param {string} id - Mongo _id of the user (Admin/Owner/Tenant)
 * @param {string} role - 'admin' | 'owner' | 'tenant'
 * @returns {string} signed JWT
 */
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

module.exports = generateToken;

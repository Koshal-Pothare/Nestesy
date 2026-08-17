const { error } = require('../utils/response');

/**
 * Handle 404 Not Found requests
 */
const notFound = (req, res, next) => {
  return error(res, 404, `Route not found - ${req.originalUrl}`);
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || 'Internal Server Error';

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };

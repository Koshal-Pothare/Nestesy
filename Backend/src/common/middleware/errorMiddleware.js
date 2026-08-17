/**
 * 404 Not Found Middleware
 * Handles requests for routes that do not exist.
 */
const notFound = (req, res, next) => {
  const error = new Error(
    `Route not found: ${req.method} ${req.originalUrl}`
  );

  res.status(404);

  next(error);
};


/**
 * Global Error Handler Middleware
 * Handles all errors generated inside the application.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode =
    res.statusCode && res.statusCode !== 200
      ? res.statusCode
      : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack
    })
  });
};


/**
 * Export middleware functions
 */
module.exports = {
  notFound,
  errorHandler
};
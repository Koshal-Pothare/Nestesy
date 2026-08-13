const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./common/middleware/errorMiddleware');

// Admin routes
const adminAuthRoutes = require('./admin/routes/adminAuthRoutes');

// Owner routes
const ownerAuthRoutes = require('./owner/routes/ownerAuthRoutes');

// Tenant routes
const tenantAuthRoutes = require('./tenant/routes/tenantAuthRoutes');

const app = express();

// --- Core middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Nestesy API is running' });
});

// --- Role-based routes ---
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/owner/auth', ownerAuthRoutes);
app.use('/api/tenant/auth', tenantAuthRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
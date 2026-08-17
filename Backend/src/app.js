const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { notFound, errorHandler } = require('./common/middleware/errorMiddleware');

// Common & Unified Auth routes
const commonAuthRoutes = require('./common/routes/commonAuthRoutes');

// Admin routes
const adminAuthRoutes = require('./admin/routes/adminAuthRoutes');
const adminDashboardRoutes = require('./admin/routes/adminDashboardRoutes');
const ownerManagementRoutes = require('./admin/routes/ownerManagementRoutes');
const tenantManagementRoutes = require('./admin/routes/tenantManagementRoutes');
const propertyManagementRoutes = require('./admin/routes/propertyManagementRoutes');
const bookingManagementRoutes = require('./admin/routes/bookingManagementRoutes');
const reviewManagementRoutes = require('./admin/routes/reviewManagementRoutes');

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

// --- Unified Auth routes ---
app.use('/api/auth', commonAuthRoutes);

// --- Admin routes ---
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin/owners', ownerManagementRoutes);
app.use('/api/admin/tenants', tenantManagementRoutes);
app.use('/api/admin/properties', propertyManagementRoutes);
app.use('/api/admin/bookings', bookingManagementRoutes);
app.use('/api/admin/reviews', reviewManagementRoutes);

// --- Owner/Host routes ---
app.use('/api/owner/auth', ownerAuthRoutes);

// --- Tenant routes ---
app.use('/api/tenant/auth', tenantAuthRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
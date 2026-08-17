const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');

// Import Routes
const ownerAuthRoutes = require('./owner/routes/ownerAuthRoutes');
const propertyRoutes = require('./owner/routes/propertyRoutes');
const ownerDashboardRoutes = require('./owner/routes/ownerDashboardRoutes');

const app = express();

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Important for cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Mount Routers
app.use('/api/owners', ownerAuthRoutes);
app.use('/api/owners/properties', propertyRoutes);
app.use('/api/owners/dashboard', ownerDashboardRoutes);

module.exports = app;
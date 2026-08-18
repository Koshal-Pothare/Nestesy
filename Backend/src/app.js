const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");

const { notFound, errorHandler } = require('./common/middleware/errorMiddleware');

// Admin routes
const adminAuthRoutes = require('./admin/routes/adminAuthRoutes');

// Owner routes
const ownerAuthRoutes = require('./owner/routes/ownerAuthRoutes');

// Tenant routes
const tenantAuthRoutes = require('./tenant/routes/tenantAuthRoutes');

const app = express();

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// CORS
// ===============================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ===============================
// BODY PARSERS
// ===============================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// COOKIE PARSER
// ===============================

app.use(cookieParser());

// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NESTESY Backend API is running",
  });
});

// ===============================
// HEALTH CHECK
// ===============================

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// --- Role-based routes ---
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/owner/auth', ownerAuthRoutes);
app.use('/api/tenant/auth', tenantAuthRoutes);

// ==================================================
// OWNER ROOMS
// ==================================================

app.use(
  "/api/owners",
  roomRoutes
);

// ==================================================
// OWNER PROFILE
// ==================================================

app.use(
  "/api/owners",
  ownerProfileRoutes
);

// ==================================================
// PUBLIC PROPERTIES
// ==================================================

app.use(
  "/api/properties",
  publicPropertyRoutes
);

// ==================================================
// 404
// ==================================================

app.use(notFound);



app.use(errorHandler);

module.exports = app;
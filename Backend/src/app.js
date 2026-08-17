const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");

const {
  notFound,
  errorHandler,
} = require("./common/middleware/errorMiddleware");

// ===============================
// OWNER ROUTES
// ===============================

const ownerAuthRoutes = require("./owner/routes/ownerAuthRoutes");
const propertyRoutes = require("./owner/routes/propertyRoutes");
const ownerDashboardRoutes = require("./owner/routes/ownerDashboardRoutes");
const visitRoutes = require("./owner/routes/visitRoutes");
const analyticsRoutes = require("./owner/routes/analyticsRoutes");
const roomRoutes = require("./owner/routes/roomRoutes");
const ownerProfileRoutes = require("./owner/routes/ownerProfileRoutes");

// ===============================
// PUBLIC ROUTES
// ===============================

const publicPropertyRoutes = require("./public/routes/publicPropertyRoutes");

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

// ==================================================
// OWNER AUTH
// POST /api/owners/register
// POST /api/owners/login
// POST /api/owners/logout
// ==================================================

app.use(
  "/api/owners",
  ownerAuthRoutes
);

// ==================================================
// OWNER PROPERTIES
//
// GET    /api/owners/properties
// GET    /api/owners/properties/:id
// POST   /api/owners/properties
// DELETE /api/owners/properties/:id
// PATCH  /api/owners/properties/:id/status
// ==================================================

app.use(
  "/api/owners/properties",
  propertyRoutes
);

// ==================================================
// OWNER DASHBOARD
//
// GET /api/owners/dashboard/stats
// ==================================================

app.use(
  "/api/owners/dashboard",
  ownerDashboardRoutes
);

// ==================================================
// OWNER VISITS
// ==================================================

app.use(
  "/api/owners/visits",
  visitRoutes
);

// ==================================================
// OWNER ANALYTICS
// ==================================================

app.use(
  "/api/owners/analytics",
  analyticsRoutes
);

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
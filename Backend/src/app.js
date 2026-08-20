require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/database");

const {
  notFound,
  errorHandler,
} = require("./common/middleware/errorMiddleware");

const commonAuthRoutes = require("./common/routes/commonAuthRoutes");
const contactRoutes = require("./common/routes/contactRoutes");

const adminAuthRoutes = require("./admin/routes/adminAuthRoutes");
const adminDashboardRoutes = require("./admin/routes/adminDashboardRoutes");
const ownerManagementRoutes = require("./admin/routes/ownerManagementRoutes");
const tenantManagementRoutes = require("./admin/routes/tenantManagementRoutes");
const propertyManagementRoutes = require("./admin/routes/propertyManagementRoutes");
const bookingManagementRoutes = require("./admin/routes/bookingManagementRoutes");
const reviewManagementRoutes = require("./admin/routes/reviewManagementRoutes");

const ownerAuthRoutes = require("./owner/routes/ownerAuthRoutes");
const propertyRoutes = require("./owner/routes/propertyRoutes");
const ownerDashboardRoutes = require("./owner/routes/ownerDashboardRoutes");
const visitRoutes = require("./owner/routes/visitRoutes");
const analyticsRoutes = require("./owner/routes/analyticsRoutes");
const roomRoutes = require("./owner/routes/roomRoutes");
const ownerProfileRoutes = require("./owner/routes/ownerProfileRoutes");

const tenantAuthRoutes = require("./User/routes/tenantAuthRoutes");
const tenantFavoriteRoutes = require("./User/routes/tenantFavoriteRoutes");
const tenantBookingRoutes = require("./User/routes/tenantBookingRoutes");
const tenantReviewRoutes = require("./User/routes/reviewRoutes");
const tenantProfileRoutes = require("./User/routes/tenantProfileRoutes");

const publicPropertyRoutes = require("./public/routes/publicPropertyRoutes");

const app = express();

// DATABASE
connectDB();

// CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// BODY & COOKIE PARSERS
app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);
app.use(cookieParser());

// ROOT & HEALTH CHECK
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NESTESY Backend API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is working",
  });
});

// UNIFIED & ROLE-BASED ROUTE MOUNTS
app.use("/api/auth", commonAuthRoutes);

// Admin Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/owners", ownerManagementRoutes);
app.use("/api/admin/tenants", tenantManagementRoutes);
app.use("/api/admin/properties", propertyManagementRoutes);
app.use("/api/admin/bookings", bookingManagementRoutes);
app.use("/api/admin/reviews", reviewManagementRoutes);

// Owner Routes
app.use("/api/owner/auth", ownerAuthRoutes);
app.use("/api/owners/properties", propertyRoutes);
app.use("/api/owner/properties", propertyRoutes);
app.use("/api/owners/dashboard", ownerDashboardRoutes);
app.use("/api/owner/dashboard", ownerDashboardRoutes);
app.use("/api/owners/visits", visitRoutes);
app.use("/api/owner/visits", visitRoutes);
app.use("/api/owners/analytics", analyticsRoutes);
app.use("/api/owner/analytics", analyticsRoutes);
app.use("/api/owners", roomRoutes);
app.use("/api/owners", ownerProfileRoutes);
app.use("/api/owner", ownerProfileRoutes);

// Tenant / User Routes
app.use("/api/tenant/auth", tenantAuthRoutes);
app.use("/api/tenant/favorites", tenantFavoriteRoutes);
app.use("/api/tenant/bookings", tenantBookingRoutes);
app.use("/api/tenant/reviews", tenantReviewRoutes);
app.use("/api/tenant/profile", tenantProfileRoutes);

// Public Routes
app.use("/api/properties", publicPropertyRoutes);
app.use("/api/contact", contactRoutes);

// ERROR HANDLING
app.use(notFound);
app.use(errorHandler);

module.exports = app;
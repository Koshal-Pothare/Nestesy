const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const connectDB = require("./config/database");

const {
  notFound,
  errorHandler,
} = require("./common/middleware/errorMiddleware");

const commonAuthRoutes = require("./common/routes/commonAuthRoutes");

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

const publicPropertyRoutes = require("./public/routes/publicPropertyRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

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

app.use("/api/auth", commonAuthRoutes);

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/dashboard", adminDashboardRoutes);
app.use("/api/admin/owners", ownerManagementRoutes);
app.use("/api/admin/tenants", tenantManagementRoutes);
app.use("/api/admin/properties", propertyManagementRoutes);
app.use("/api/admin/bookings", bookingManagementRoutes);
app.use("/api/admin/reviews", reviewManagementRoutes);

app.use("/api/owner/auth", ownerAuthRoutes);
app.use("/api/owners/properties", propertyRoutes);
app.use("/api/owners/dashboard", ownerDashboardRoutes);
app.use("/api/owners/visits", visitRoutes);
app.use("/api/owners/analytics", analyticsRoutes);
app.use("/api/owners", roomRoutes);
app.use("/api/owners", ownerProfileRoutes);

app.use("/api/tenant/auth", tenantAuthRoutes);

app.use("/api/properties", publicPropertyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
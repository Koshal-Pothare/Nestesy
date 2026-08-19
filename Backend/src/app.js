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

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
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

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

if (require.main === module) {
  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
  });

  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
  });

  startServer();
}

module.exports = app;
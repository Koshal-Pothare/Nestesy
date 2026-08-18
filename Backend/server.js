require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/database");
const { verifyCloudinaryConfig } = require("./src/config/cloudinary");

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    const requiredEnv = [
      "MONGO_URI",
      "JWT_SECRET",
      "CLOUDINARY_CLOUD_NAME",
      "CLOUDINARY_API_KEY",
      "CLOUDINARY_API_SECRET",
    ];

    const missingEnv = requiredEnv.filter(
      (key) => !process.env[key] || !process.env[key].trim()
    );

    if (missingEnv.length > 0) {
      console.error("\n❌ Missing environment variables:");

      missingEnv.forEach((key) => {
        console.error(`   - ${key}`);
      });

      console.error("\nPlease check your backend .env file.\n");

      process.exit(1);
    }

    await connectDB();

    const cloudinaryReady = await verifyCloudinaryConfig();

    if (!cloudinaryReady) {
      console.error("❌ Cloudinary verification failed.");
      process.exit(1);
    }

    const server = app.listen(PORT, () => {
      console.log("\n========================================");
      console.log("🚀 Nestesy Backend Started");
      console.log("========================================");
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(
        `🌐 Frontend: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
      console.log(
        `🛠️ Environment: ${
          process.env.NODE_ENV || "development"
        }`
      );
      console.log("========================================\n");
    });

    const shutdown = async (signal) => {
      console.log(`\n⚠️ ${signal} received. Shutting down...`);

      server.close(async () => {
        try {
          const mongoose = require("mongoose");
          await mongoose.connection.close();

          console.log("✅ MongoDB connection closed");
          console.log("✅ Server stopped");

          process.exit(0);
        } catch (error) {
          console.error("❌ Error during shutdown:", error.message);
          process.exit(1);
        }
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));

    process.on("unhandledRejection", (error) => {
      console.error("❌ Unhandled Promise Rejection:", error);
      shutdown("unhandledRejection");
    });

    process.on("uncaughtException", (error) => {
      console.error("❌ Uncaught Exception:", error);
      shutdown("uncaughtException");
    });
  } catch (error) {
    console.error("\n❌ Failed to start server:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
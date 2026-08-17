require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./src/config/database');

const PORT = process.env.PORT || 5000;

/**
 * Connect to MongoDB first, then start listening.
 * This avoids accepting requests before the DB is ready.
 */
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Nestesy server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });

    // Gracefully handle unexpected errors instead of crashing silently
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
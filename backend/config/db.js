const mongoose = require('mongoose');

const connectDB = async () => {
  // Reuse existing connection if already open/connecting (vital for serverless)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[MongoDB] MONGO_URI is not set in environment variables.');
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 has sensible defaults; these make startup logs cleaner
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected to Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

module.exports = connectDB;

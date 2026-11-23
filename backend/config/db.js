const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error('[MongoDB] MONGO_URI is not set in .env — aborting.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      // Mongoose 8 has sensible defaults; these make startup logs cleaner
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected to Atlas: ${conn.connection.host}`);
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;

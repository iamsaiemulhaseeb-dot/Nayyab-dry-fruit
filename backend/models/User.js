const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: 'Hafiz Sumair',
    },
    role: {
      type: String,
      enum: ['admin', 'manager', 'staff'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);

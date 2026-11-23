const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'productId is required'],
      index: true,
    },
    productName: {
      type: String,
      default: '',
      trim: true,
    },
    customerName: {
      type: String,
      required: [true, 'customerName is required'],
      trim: true,
    },
    rating: {
      type: Number,
      required: [true, 'rating is required'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);

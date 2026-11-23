const mongoose = require('mongoose');

const bulkInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'phone is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'city is required'],
      trim: true,
    },
    shopName: {
      type: String,
      default: '',
      trim: true,
    },
    eventName: {
      type: String,
      default: '',
      trim: true,
    },
    items: {
      type: [String],
      default: [],
    },
    quantityKg: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'closed'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BulkInquiry', bulkInquirySchema);

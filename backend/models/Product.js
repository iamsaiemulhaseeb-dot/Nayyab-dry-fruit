const mongoose = require('mongoose');

const weightSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true // e.g. '250g', '500g', '1 kg'
    },
    multiplier: {
      type: Number,
      required: true // e.g. 0.25, 0.50, 1.00
    }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    subtitle: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: true,
      enum: ['nuts', 'kernels', 'dried-fruits', 'dates', 'honey', 'combos'],
      default: 'nuts',
      index: true
    },
    badge: {
      type: String,
      trim: true,
      default: 'Fresh Harvest'
    },
    badgeColor: {
      type: String,
      default: 'bg-emerald-700'
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 1,
      max: 5
    },
    reviewsCount: {
      type: Number,
      default: 100
    },
    pricePerKg: {
      type: Number,
      required: [true, 'Price per kg is required'],
      min: 0
    },
    originalPricePerKg: {
      type: Number,
      required: [true, 'Original price per kg is required'],
      min: 0
    },
    image: {
      type: String,
      required: [true, 'Product image path is required']
    },
    fallbackImage: {
      type: String,
      default: ''
    },
    origin: {
      type: String,
      default: 'Imported Grade-A Selection'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    packaging: {
      type: String,
      default: 'Airtight Vacuum-Sealed Foil Pouch for 100% freshness.'
    },
    benefits: {
      type: [String],
      default: []
    },
    weights: {
      type: [weightSchema],
      default: [
        { label: '250g', multiplier: 0.25 },
        { label: '500g', multiplier: 0.50 },
        { label: '1 kg', multiplier: 1.00 }
      ]
    },
    inStock: {
      type: Boolean,
      default: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', productSchema);

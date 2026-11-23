const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    weightLabel: {
      type: String,
      required: true // '250g', '500g', '1 kg'
    },
    multiplier: {
      type: Number,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    itemTotal: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customer: {
      name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true
      },
      phone: {
        type: String,
        required: [true, 'Customer phone number is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'Delivery city is required'],
        trim: true
      },
      address: {
        type: String,
        required: [true, 'Complete delivery address is required'],
        trim: true
      },
      notes: {
        type: String,
        trim: true,
        default: ''
      }
    },
    items: {
      type: [orderItemSchema],
      required: [true, 'Order must contain at least one item'],
      validate: [val => val.length > 0, 'Order cannot be empty']
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      default: 'Cash on Delivery (COD)',
      enum: ['Cash on Delivery (COD)', 'Bank Transfer', 'JazzCash / EasyPaisa', 'JazzCash / EasyPaisa / Bank']
    },
    paymentProof: {
      type: String,
      default: ''   // base64 data-URL or empty
    },
    paymentProofName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Order', orderSchema);

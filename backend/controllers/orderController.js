const Order = require('../models/Order');

// ── POST /api/orders ──────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      orderId, name, customerName, phone, city, address, notes,
      items, subtotal, deliveryFee, discount, total, paymentMethod,
      paymentProof, paymentProofName,
    } = req.body;

    // Support flat fields OR nested customer object from the frontend
    const c = req.body.customer || {};
    const finalName    = (name    || customerName || c.name    || '').trim();
    const finalPhone   = (phone   || c.phone   || '').trim();
    const finalCity    = (city    || c.city    || '').trim();
    const finalAddress = (address || c.address || '').trim();
    const finalNotes   = (notes   || c.notes   || '').trim();

    if (!finalName || !finalPhone || !finalCity || !finalAddress) {
      return res.status(400).json({
        success: false,
        message: 'Please provide Name, Phone, City and Address.',
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    const finalOrderId = orderId || 'NYB-' + Math.floor(100000 + Math.random() * 900000);

    const formattedItems = items.map(item => {
      const price    = Number(item.price || item.unitPrice || 0);
      const quantity = Number(item.quantity || 1);
      const iTotal   = Number(item.itemTotal > 0 ? item.itemTotal : price * quantity);
      return {
        productId:   item.id || item.productId || 'custom-item',
        name:        item.name || 'Dry Fruit Item',
        weightLabel: item.weightLabel || item.weight || '1 kg',
        multiplier:  Number(item.multiplier || 1),
        price,
        unitPrice:   price,
        quantity,
        itemTotal:   iTotal,
        image:       item.image || '',
      };
    });

    const calcSubtotal    = subtotal    !== undefined ? Number(subtotal)    : formattedItems.reduce((s, i) => s + i.itemTotal, 0);
    const calcDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : calcSubtotal >= 5000 ? 0 : 250;
    const calcDiscount    = Number(discount || 0);
    const calcTotal       = total       !== undefined ? Number(total)       : calcSubtotal + calcDeliveryFee - calcDiscount;

    const order = await Order.create({
      orderId:         finalOrderId,
      customer:        { name: finalName, phone: finalPhone, city: finalCity, address: finalAddress, notes: finalNotes },
      items:           formattedItems,
      subtotal:        calcSubtotal,
      deliveryFee:     calcDeliveryFee,
      discount:        calcDiscount,
      total:           calcTotal,
      paymentMethod:   paymentMethod || 'Cash on Delivery (COD)',
      paymentProof:    paymentProof     || '',
      paymentProofName:paymentProofName || '',
      status:          'pending',
    });

    console.log(`[Order Saved] ${order.orderId} — ${finalName} (Rs. ${calcTotal})`);
    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Hafiz Sumair will dispatch your parcel shortly.',
      data:    order,
    });
  } catch (err) {
    console.error('[createOrder]', err.message);
    res.status(500).json({ success: false, message: 'Failed to create order', error: err.message });
  }
};

// ── GET /api/orders ───────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;

    if (search && search.trim()) {
      const q = new RegExp(search.trim(), 'i');
      filter.$or = [
        { orderId:         q },
        { 'customer.name': q },
        { 'customer.phone':q },
        { 'customer.city': q },
      ];
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: orders.length, data: orders });
  } catch (err) {
    console.error('[getAllOrders]', err.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve orders', error: err.message });
  }
};

// ── GET /api/orders/stats/summary ────────────────────────
const getOrderStats = async (req, res) => {
  try {
    const [total, pending, confirmed, delivered, revenue] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: 'confirmed' }),
      Order.countDocuments({ status: 'delivered' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalOrders:     total,
        pendingOrders:   pending,
        confirmedOrders: confirmed,
        deliveredOrders: delivered,
        totalRevenue:    revenue[0]?.total || 0,
      },
    });
  } catch (err) {
    console.error('[getOrderStats]', err.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve stats', error: err.message });
  }
};

// ── GET /api/orders/:id ───────────────────────────────────
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    // Support both orderId string (NYB-XXXX) and MongoDB _id
    const order = await Order.findOne({
      $or: [{ orderId: id }, { _id: id.match(/^[a-f\d]{24}$/i) ? id : undefined }],
    }).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: `Order not found: ${id}` });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    console.error('[getOrderById]', err.message);
    res.status(500).json({ success: false, message: 'Failed to retrieve order', error: err.message });
  }
};

// ── PATCH /api/orders/:id  &  PATCH /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const normalised = (req.body.status || '').toLowerCase().trim();
    const valid = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!valid.includes(normalised)) {
      return res.status(400).json({ success: false, message: `Invalid status. Valid: ${valid.join(', ')}` });
    }

    const order = await Order.findOneAndUpdate(
      { $or: [{ orderId: id }, { _id: id.match(/^[a-f\d]{24}$/i) ? id : undefined }] },
      { $set: { status: normalised } },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({ success: false, message: `Order not found: ${id}` });
    }

    res.json({ success: true, message: `Order status updated to '${normalised}'.`, data: order });
  } catch (err) {
    console.error('[updateOrderStatus]', err.message);
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
};

module.exports = { createOrder, getAllOrders, getOrderById, updateOrderStatus, getOrderStats };

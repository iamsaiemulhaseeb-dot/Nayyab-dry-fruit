const BulkInquiry = require('../models/BulkInquiry');

// ── GET /api/bulk-inquiries ───────────────────────────────
const getAll = async (req, res) => {
  try {
    const inquiries = await BulkInquiry.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: inquiries });
  } catch (err) {
    console.error('[getAll BulkInquiry]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/bulk-inquiries ──────────────────────────────
const create = async (req, res) => {
  try {
    const { name, phone, city, shopName, eventName, items, quantityKg, notes } = req.body;

    if (!name || !phone || !city) {
      return res.status(400).json({ success: false, message: 'name, phone and city are required.' });
    }

    const inquiry = await BulkInquiry.create({
      name:       name.trim(),
      phone:      phone.trim(),
      city:       city.trim(),
      shopName:   (shopName  || '').trim(),
      eventName:  (eventName || '').trim(),
      items:      Array.isArray(items) ? items : [],
      quantityKg: Number(quantityKg) || 0,
      notes:      (notes || '').trim(),
      status:     'new',
    });

    res.status(201).json({ success: true, data: inquiry });
  } catch (err) {
    console.error('[create BulkInquiry]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/bulk-inquiries/:id/status ─────────────────
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['new', 'contacted', 'closed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const inquiry = await BulkInquiry.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found.' });
    res.json({ success: true, data: inquiry });
  } catch (err) {
    console.error('[updateStatus BulkInquiry]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/bulk-inquiries/:id ────────────────────────
const remove = async (req, res) => {
  try {
    const inquiry = await BulkInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    console.error('[remove BulkInquiry]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAll, create, updateStatus, remove };

const Review = require('../models/Review');

// ── GET /api/reviews ──────────────────────────────────────
const getAllReviews = async (req, res) => {
  try {
    const { productId, status } = req.query;
    const filter = {};
    if (productId)                       filter.productId = productId;
    if (status && status !== 'all')      filter.status    = status;

    const reviews = await Review.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (err) {
    console.error('[getAllReviews]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── POST /api/reviews ─────────────────────────────────────
const createReview = async (req, res) => {
  try {
    const { productId, productName, customerName, rating, comment } = req.body;

    if (!productId || !customerName || !rating) {
      return res.status(400).json({
        success: false,
        message: 'productId, customerName and rating are required.',
      });
    }
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be 1–5.' });
    }

    const review = await Review.create({
      productId,
      productName:  (productName  || '').trim(),
      customerName: customerName.trim(),
      rating:       Number(rating),
      comment:      (comment || '').trim(),
      status:       'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted! It will appear after approval.',
      data:    review,
    });
  } catch (err) {
    console.error('[createReview]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── PATCH /api/reviews/:id/status ────────────────────────
const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    ).lean();

    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: `Review ${status}.`, data: review });
  } catch (err) {
    console.error('[updateReviewStatus]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// ── DELETE /api/reviews/:id ───────────────────────────────
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    res.json({ success: true, message: 'Review deleted.' });
  } catch (err) {
    console.error('[deleteReview]', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllReviews, createReview, updateReviewStatus, deleteReview };

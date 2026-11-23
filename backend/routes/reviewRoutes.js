const express = require('express');
const router = express.Router();
const { getAllReviews, createReview, updateReviewStatus, deleteReview } = require('../controllers/reviewController');

router.get('/', getAllReviews);
router.post('/', createReview);
router.patch('/:id/status', updateReviewStatus);
router.delete('/:id', deleteReview);

module.exports = router;

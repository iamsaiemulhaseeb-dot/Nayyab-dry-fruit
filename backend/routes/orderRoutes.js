const express = require('express');
const router = express.Router();

const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
} = require('../controllers/orderController');

// Summary statistics endpoint (placed before /:id so it doesn't get treated as an ID param)
router.get('/stats/summary', getOrderStats);

// Main order routes
router.route('/')
  .post(createOrder)
  .get(getAllOrders);

router.route('/:id')
  .get(getOrderById)
  .patch(updateOrderStatus);

router.route('/:id/status')
  .patch(updateOrderStatus);

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  seedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Seed products endpoint
router.post('/seed', seedProducts);

// General product endpoints
router.route('/')
  .get(getAllProducts)
  .post(createProduct);

router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;

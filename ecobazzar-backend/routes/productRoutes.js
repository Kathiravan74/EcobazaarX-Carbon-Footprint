const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

const SELLER_ROLE_ID = 2; 

// @route   GET /api/products/search
// @desc    Search and filter products
// @access  Public
// NOTE: This must be placed before the '/:id' route.
router.get('/search', productController.searchProducts);

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/:id
// @desc    Get a single product
// @access  Public
router.get('/:id', productController.getProductById);

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Sellers only)
router.post('/', auth, authorizeRoles([SELLER_ROLE_ID]), productController.createProduct);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Sellers only)
router.put('/:id', auth, authorizeRoles([SELLER_ROLE_ID]), productController.updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Sellers only)
router.delete('/:id', auth, authorizeRoles([SELLER_ROLE_ID]), productController.deleteProduct);

module.exports = router;
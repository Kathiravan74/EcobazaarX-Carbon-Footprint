const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/authMiddleware');

// @route   POST /api/cart/add
// @desc    Add a product to the cart or update quantity
// @access  Private (Customers only)
router.post('/add', auth, cartController.addItemToCart);

// @route   GET /api/cart
// @desc    Get all items in the user's cart
// @access  Private (Customers only)
router.get('/', auth, cartController.getCartItems);

// @route   DELETE /api/cart/:productId
// @desc    Remove an item from the cart
// @access  Private (Customers only)
router.delete('/:productId', auth, cartController.removeItemFromCart);

module.exports = router;
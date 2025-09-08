const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

const ADMIN_ROLE_ID = 3;

const SELLER_ROLE_ID = 2;
router.put(
  '/:id',
  auth,
  authorizeRoles([SELLER_ROLE_ID, ADMIN_ROLE_ID]), // ALLOW seller and admin
  orderController.updateOrderStatus
);

router.get('/seller/orders', auth, authorizeRoles([SELLER_ROLE_ID]), orderController.getSellerOrders);
// @route   POST /api/orders/checkout
// @desc    Place an order from the cart
// @access  Private (Customers only)
router.post('/checkout', auth, orderController.placeOrder);

// @route   GET /api/orders/history
// @desc    Get user's order history
// @access  Private (Customers only)
router.get('/history', auth, orderController.getOrderHistory);

// @route   GET /api/orders
// @desc    Get all orders (Admin View)
// @access  Private (Admin only)
router.get(
    '/',
    auth,
    authorizeRoles([ADMIN_ROLE_ID]), // Using the generic authorizeRoles middleware
    orderController.getAllOrders
);

// @route   PUT /api/orders/:id
// @desc    Update order status (Admin only)
// @access  Private (Admin only)
router.put(
    '/:id',
    auth,
    authorizeRoles([ADMIN_ROLE_ID]),
    orderController.updateOrderStatus
);

module.exports = router;
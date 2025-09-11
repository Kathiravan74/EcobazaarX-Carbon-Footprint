const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, authorizeRoles } = require('../middleware/authMiddleware');

const ADMIN_ROLE_ID = 3; // Ensure this matches your database role ID

// @route   GET /api/admin/products
// @desc    Admin: Get all products
// @access  Private (Admin only)
router.get(
  '/products',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getAllProductsAdmin
);

// @route   GET /api/admin/users
// @desc    Admin: Get all users
// @access  Private (Admin only)
router.get(
  '/users',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getAllUsers
);

// @route   GET /api/admin/orders
// @desc    Admin: Get all orders
// @access  Private (Admin only)
router.get(
  '/orders',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getAllOrders
);

// @route   PUT /api/admin/users/:id/role
// @desc    Admin: Update user role
// @access  Private (Admin only)
router.put(
  '/users/:id/role',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.updateUserRole
);

// ---------------------------------------------
// Additional routes for your requirements:
// ---------------------------------------------

// @route   GET /api/admin/sellers
// @desc    Admin: Get all sellers
// @access  Private (Admin only)
router.get(
  '/sellers',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getAllSellers
);

// @route   DELETE /api/admin/sellers/:sellerId
// @desc    Admin: Delete a seller
// @access  Private (Admin only)
router.delete(
  '/sellers/:sellerId',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.deleteSeller
);

// ---------------------------------------------
// Analytics routes
// ---------------------------------------------

// @route   GET /api/admin/analytics/top-customer
// @desc    Admin: Get top customer by purchases
// @access  Private (Admin only)
router.get(
  '/analytics/top-customer',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getTopCustomer
);

// @route   GET /api/admin/analytics/top-seller
// @desc    Admin: Get top seller by sales
// @access  Private (Admin only)
router.get(
  '/analytics/top-seller',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getTopSeller
);

// @route   GET /api/admin/analytics/most-sold-products
// @desc    Admin: Get most sold products
// @access  Private (Admin only)
router.get(
  '/analytics/most-sold-products',
  auth,
  authorizeRoles([ADMIN_ROLE_ID]),
  adminController.getMostSoldProducts
);

module.exports = router;

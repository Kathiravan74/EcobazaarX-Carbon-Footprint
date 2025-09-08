const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Admin: Get all products (including inactive)
// @route   GET /api/admin/products
// @access  Private (Admin only)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.getAll(); // Assuming a model method that gets all products
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting all products for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all users (customers and sellers)
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll(); // A new method you'll add in the next step
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/admin/orders
// @access  Private (Admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrdersAdmin(); // A new method you'll add in the next step
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting all orders for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin: Update user role (e.g., from customer to seller)
// @route   PUT /api/admin/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRoleId } = req.body;
    
    // You'll need to add a new method to the User model for this
    const result = await User.updateRole(id, newRoleId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
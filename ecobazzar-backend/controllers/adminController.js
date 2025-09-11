const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const db = require('../db');

// Existing functions (keep these)
exports.getAllProductsAdmin = async (req, res) => {
  try {
    const products = await Product.getAll();
    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting all products for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error getting all users for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrdersAdmin();
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting all orders for admin:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { newRoleId } = req.body;
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

// NEW FUNCTIONS FOR YOUR REQUIREMENTS

// Get all sellers (for the Sellers view)
exports.getAllSellers = async (req, res) => {
  try {
    const [sellers] = await db.query(
      `SELECT user_id, username, first_name, last_name, email, created_at, updated_at 
       FROM users WHERE role_id = 2 ORDER BY created_at DESC`
    );
    res.status(200).json(sellers);
  } catch (error) {
    console.error('Error getting all sellers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete seller (Admin only)
// controllers/adminController.js

// controllers/adminController.js

exports.deleteSeller = async (req, res) => {
  const { sellerId } = req.params;
  if (req.user.roleId !== 3) {
    return res.status(403).json({ message: 'Unauthorized. Admin only.' });
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Delete any cart_items for this seller's cart(s)
    await connection.query(
      `DELETE ci FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.cart_id
       WHERE c.user_id = ?`,
      [sellerId]
    );

    // 2. Delete the seller’s cart(s)
    await connection.query(
      'DELETE FROM carts WHERE user_id = ?',
      [sellerId]
    );

    // 3. Delete order_items for this seller’s products
    await connection.query(
      `DELETE oi FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       WHERE p.seller_id = ?`,
      [sellerId]
    );

    // 4. Delete the seller’s products
    await connection.query(
      'DELETE FROM products WHERE seller_id = ?',
      [sellerId]
    );

    // 5. Finally delete the user row
    const [result] = await connection.query(
      'DELETE FROM users WHERE user_id = ? AND role_id = 2',
      [sellerId]
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ message: 'Seller not found' });
    }

    await connection.commit();
    res.status(200).json({ message: 'Seller and all dependencies deleted successfully' });
  } catch (err) {
    await connection.rollback();
    console.error('Error deleting seller:', err);
    res.status(500).json({ message: 'Failed to delete seller' });
  } finally {
    connection.release();
  }
};



// Get top customer by number of purchases
exports.getTopCustomer = async (req, res) => {
  try {
    const [topCustomer] = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(o.order_id) as total_purchases,
        SUM(o.total_price) as total_spent
      FROM users u
      JOIN orders o ON u.user_id = o.user_id
      WHERE u.role_id = 1
      GROUP BY u.user_id
      ORDER BY total_purchases DESC, total_spent DESC
      LIMIT 1
    `);

    res.status(200).json(topCustomer[0] || null);
  } catch (error) {
    console.error('Error getting top customer:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get top seller by total sales amount
exports.getTopSeller = async (req, res) => {
  try {
    const [topSeller] = await db.query(`
      SELECT 
        u.user_id,
        u.username,
        u.first_name,
        u.last_name,
        u.email,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(oi.quantity * oi.price_at_purchase) as total_sales
      FROM users u
      JOIN products p ON u.user_id = p.seller_id
      JOIN order_items oi ON p.product_id = oi.product_id
      JOIN orders o ON oi.order_id = o.order_id
      WHERE u.role_id = 2
      GROUP BY u.user_id
      ORDER BY total_sales DESC
      LIMIT 1
    `);

    res.status(200).json(topSeller[0] || null);
  } catch (error) {
    console.error('Error getting top seller:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get most sold products by quantity
exports.getMostSoldProducts = async (req, res) => {
  try {
    const [products] = await db.query(`
      SELECT 
        p.product_id,
        p.name as product_name,
        p.price,
        SUM(oi.quantity) as total_quantity_sold,
        SUM(oi.quantity * oi.price_at_purchase) as total_revenue
      FROM products p
      JOIN order_items oi ON p.product_id = oi.product_id
      GROUP BY p.product_id
      ORDER BY total_quantity_sold DESC
      LIMIT 10
    `);

    res.status(200).json(products);
  } catch (error) {
    console.error('Error getting most sold products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

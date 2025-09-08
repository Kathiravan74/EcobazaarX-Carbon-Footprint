const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const SELLER_ROLE_ID = 2;
const db = require('../db');// ⬅️ The path and variable name may vary, check your project structure!
// Place an order (checkout)
const sendNotificationToCustomer = async (userId, message) => {
  // Implement notification (email, push notification, or store in DB)
  // For demo, just log
  console.log(`Notify user ${userId}: ${message}`)
}
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Get the user's cart items
    const cartId = await Cart.findOrCreateByUserId(userId);
    const cartItems = await Cart.getItems(cartId);

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Fetch carbon values from the products table
    const productIds = cartItems.map(item => item.product_id);
    const productsData = await Product.getProductsByIds(productIds);

    // Create a map for quick lookup
    const productsMap = new Map(productsData.map(p => [p.product_id, p]));

    // Calculate total price and total carbon value
    const total_price = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total_carbon_value = cartItems.reduce((sum, item) => {
      const product = productsMap.get(item.product_id);
      return sum + (product.carbon_value * item.quantity);
    }, 0);

    const orderId = await Order.createOrderFromCart(userId, cartId, total_price, total_carbon_value);

    res.status(201).json({ message: 'Order placed successfully', orderId });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.getAllOrders = async (req, res) => {
    try {
        // ⚠️ Placeholder Logic: Fetch all orders from the database
        const query = 'SELECT o.order_id, o.user_id, o.total_price, o.status, o.created_at, u.email as user_email FROM orders o JOIN users u ON o.user_id = u.user_id ORDER BY o.created_at DESC';
        const [orders] = await db.query(query); // Assuming 'db' is your database connection

        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.userId; // from JWT
    const orders = await Order.findBySellerId(sellerId);
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching seller orders:', err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; // Order ID
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status field is required.' });
    }

    // If seller, ensure they own the product(s) in the order
    if (req.user.roleId === SELLER_ROLE_ID) {
      // Check if the seller owns at least one product in the order
      const sql = `
        SELECT COUNT(*) as count FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ? AND p.seller_id = ?`;
      const [rows] = await db.query(sql, [id, req.user.userId]);
      if (rows[0].count === 0) {
        return res.status(403).json({ message: 'Forbidden: You cannot ship this order' });
      }
    }

    const query = 'UPDATE orders SET status = ? WHERE order_id = ?';
     const [result] = await db.query(
      "UPDATE orders SET status = ? WHERE order_id = ?", [status, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found.' });
    }
    const [orderRows] = await db.query("SELECT user_id FROM orders WHERE order_id = ?", [id]);
    if (orderRows.length) {
      const userId = orderRows[0].user_id;
      if (status.toLowerCase() === "shipped") {
        await sendNotificationToCustomer(userId, "Your product is on the way!");
      }
    }
    // TODO: Trigger a notification to customer here
    res.status(200).json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's order history
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.getOrderHistory(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error('Error getting order history:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
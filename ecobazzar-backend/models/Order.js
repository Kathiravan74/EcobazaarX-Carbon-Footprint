const db = require('../db');

class Order {
  // Create a new order from a cart
  static async createOrderFromCart(userId, cartId, total_price, total_carbon_value) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      // Insert into orders table
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, total_price, total_carbon_value, status) VALUES (?, ?, ?, ?)',
        [userId, total_price, total_carbon_value, 'Pending']
      );
      const orderId = orderResult.insertId;

      // Select items from cart_items AND join with products to get the price and carbon_value
      const [cartItems] = await connection.query(
        `SELECT ci.product_id, ci.quantity, p.price, p.carbon_value FROM cart_items AS ci
         JOIN products AS p ON ci.product_id = p.product_id
         WHERE ci.cart_id = ?`,
        [cartId]
      );

      // Loop through items and insert into order_items WITH the price and carbon_value
      for (const item of cartItems) {
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase, carbon_value_at_purchase) VALUES (?, ?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price, item.carbon_value]
        );
      }

      // Clear the cart
      await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

      // Commit the transaction
      await connection.commit();
      return orderId;
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }
  static async findBySellerId(sellerId) {
  const sql = `
    SELECT DISTINCT o.* FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE p.seller_id = ?
    ORDER BY o.created_at DESC
  `;
  const [rows] = await db.query(sql, [sellerId]);
  return rows;
}

  // Get a user's order history
  static async getOrderHistory(userId) {
    const [rows] = await db.query(
      `SELECT o.*, oi.order_item_id, oi.product_id, oi.quantity, oi.price_at_purchase, oi.carbon_value_at_purchase, p.name AS product_name, p.image_url AS product_image
       FROM orders AS o
       JOIN order_items AS oi ON o.order_id = oi.order_id
       JOIN products AS p ON oi.product_id = p.product_id
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );
    return rows;
  }
    static async getAllOrdersAdmin() {
    const [rows] = await db.query(
      `SELECT o.*, u.first_name, u.last_name, u.email
       FROM orders AS o
       JOIN users AS u ON o.user_id = u.user_id
       ORDER BY o.created_at DESC`
    );
    return rows;
  }
}
module.exports = Order;
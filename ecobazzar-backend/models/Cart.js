const db = require('../db');



class Cart {

  // Find a cart for a specific user. If it doesn't exist, create it.

  static async findOrCreateByUserId(userId) {

    let [rows] = await db.query('SELECT cart_id FROM carts WHERE user_id = ?', [userId]);



    if (rows.length === 0) {

      // Cart does not exist, so create a new one

      const [result] = await db.query('INSERT INTO carts (user_id) VALUES (?)', [userId]);

      const cartId = result.insertId;

      [rows] = await db.query('SELECT cart_id FROM carts WHERE cart_id = ?', [cartId]);

    }

    return rows[0].cart_id;

  }



  // Add an item to the cart or update the quantity if it already exists

  static async addItem(cartId, productId, quantity) {

    const [existingItem] = await db.query(

      'SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?',

      [cartId, productId]

    );



    if (existingItem.length > 0) {

      // Item exists, update the quantity

      await db.query(

        'UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?',

        [quantity, cartId, productId]

      );

      return 'updated';

    } else {

      // Item does not exist, add it

      await db.query(

        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)',

        [cartId, productId, quantity]

      );

      return 'created';

    }

  }



  // Get all items in a cart

  static async getItems(cartId) {
    // ⚠️ IMPORTANT: Ensure this query is exactly as written, with no extra spaces or newlines.
    const [rows] = await db.query(
      "SELECT ci.*, p.name, p.price, p.image_url, p.carbon_value FROM cart_items ci JOIN products p ON ci.product_id = p.product_id WHERE ci.cart_id = ?",
      [cartId]
    );
    return rows;
  }



  // Remove an item from the cart

  static async removeItem(cartId, productId) {

    const [result] = await db.query(

      'DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?',

      [cartId, productId]

    );

    return result.affectedRows;

  }

  // Method to get a user's cart items

  static async getCartItems(userId) {

    const [rows] = await db.query(

      `SELECT ci.product_id, ci.quantity, ci.cart_id, p.name, p.price, p.carbon_value, p.image_url

       FROM cart_items ci

       JOIN products p ON ci.product_id = p.product_id

       WHERE ci.user_id = ?`,

      [userId]

    );

    return rows;

  }

}



module.exports = Cart;
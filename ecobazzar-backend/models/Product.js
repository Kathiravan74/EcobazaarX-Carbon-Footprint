const db = require('../db');

class Product {
  // Create a new product
  static async create(seller_id, name, description, price, carbon_value, image_url, stock) {
  const [result] = await db.query(
    'INSERT INTO products (seller_id, name, description, price, carbon_value, image_url, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [seller_id, name, description, price, carbon_value, image_url, stock]
  );
  return result.insertId;
}


  // Find a product by its ID
  static async findById(productId) {
    const [rows] = await db.query('SELECT * FROM products WHERE product_id = ?', [productId]);
    return rows[0];
  }

  // Update an existing product
  static async update(productId, userId, payload) {
    // 1. Filter out undefined or null values from the payload
    const fields = Object.keys(payload).filter(key => payload[key] !== undefined && payload[key] !== null);
    
    if (fields.length === 0) {
        // Nothing to update
        return 1; 
    }

    // 2. Build the SET clause: "column1 = ?, column2 = ?, ..."
    const setClauses = fields.map(field => `${field} = ?`).join(', ');
    
    // 3. Collect the corresponding values
    const values = fields.map(field => payload[field]);
    
    // 4. Append the WHERE clause values (the product ID and user ID)
    values.push(productId, userId);

    const [result] = await db.query(
        `UPDATE products 
         SET ${setClauses} 
         WHERE product_id = ? AND seller_id = ?`,
        values // Pass the entire values array
    );
    
    return result.affectedRows;
}

  // Delete a product
  static async delete(productId) {
    const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [productId]);
    return result.affectedRows;
  }
  static async getProductsByIds(productIds) {
    const placeholders = productIds.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT product_id, carbon_value FROM products WHERE product_id IN (${placeholders})`,
      productIds
    );
    return rows;
  }
  // ... (inside the Product class)
  
  static async searchAndFilter(searchTerm, max_carbon_value) {
    let query = `
      SELECT * FROM products
      WHERE 1=1
    `;
    const queryParams = [];

    // Add search term filter
    if (searchTerm) {
      query += ` AND (name LIKE ? OR description LIKE ?)`;
      queryParams.push(`%${searchTerm}%`, `%${searchTerm}%`);
    }

    // Add carbon value filter
    if (max_carbon_value !== undefined) {
      query += ` AND carbon_value <= ?`;
      queryParams.push(max_carbon_value);
    }
    
    const [rows] = await db.query(query, queryParams);
    return rows;
  }
// ... (rest of the file)

  // Get all products (e.g., for the homepage)
  static async findAll() {
    const [rows] = await db.query('SELECT * FROM products WHERE is_active = TRUE');
    return rows;
  }
   static async getAll() {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
  }
}

module.exports = Product;
const db = require('../db'); // Import the database connection

class User {
  // Method to find a user by email
   static async create(userData) {
    const { username, first_name, last_name, email, password_hash, role_id } = userData;
    const [result] = await db.query(
      'INSERT INTO users (username, first_name, last_name, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?, ?)',
      [username, first_name, last_name, email, password_hash, role_id]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.query(
      'SELECT user_id, email, password_hash, role_id FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Method to get the role_id for a given role_name
  static async getRoleId(roleName) {
    const [rows] = await db.query('SELECT role_id FROM roles WHERE role_name = ?', [roleName]);
    if (rows.length > 0) {
      return rows[0].role_id;
    }
    return null;
  }
  static async updateProfile(userId, userData) {
    const { first_name, last_name, email } = userData;
    const [result] = await db.query(
      'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?',
      [first_name, last_name, email, userId]
    );
    return result;
  }

  static async updatePassword(userId, newHashedPassword) {
    const [result] = await db.query(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [newHashedPassword, userId]
    );
    return result;
  }
   static async getAll() {
    const [rows] = await db.query('SELECT user_id, first_name, last_name, email, role_id, created_at, updated_at FROM users');
    return rows;
  }
}

module.exports = User;
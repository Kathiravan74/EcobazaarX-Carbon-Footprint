const db = require('../db');

class User {
  // Existing methods (keep all existing code)
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
      'UPDATE users SET password_hash = ? WHERE user_id = ?',
      [newHashedPassword, userId]
    );
    return result;
  }

  static async getAll() {
    const [rows] = await db.query('SELECT user_id, username, first_name, last_name, email, role_id, created_at, updated_at FROM users');
    return rows;
  }

  // NEW METHOD FOR YOUR REQUIREMENTS
  static async updateRole(userId, newRoleId) {
    const [result] = await db.query(
      'UPDATE users SET role_id = ? WHERE user_id = ?',
      [newRoleId, userId]
    );
    return result;
  }
}

module.exports = User;

const db = require('../db');

class Feedback {
  static async create(userId, roleId, message) {
    const sql = 'INSERT INTO feedback (user_id, role_id, message) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [userId, roleId, message]);
    return result.insertId;
  }

  static async findAll() {
    const sql = `
      SELECT f.feedback_id, f.message, f.created_at, u.username, u.email, f.role_id
      FROM feedback f
      JOIN users u ON f.user_id = u.user_id
      ORDER BY f.created_at DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }
}

module.exports = Feedback;

const pool = require('../config/mysql');

class User {
  static async create(username, email) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email) VALUES (?, ?)',
      [username, email]
    );
    return { id: result.insertId, username, email };
  }
}

module.exports = User;
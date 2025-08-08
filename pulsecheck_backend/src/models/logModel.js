const pool = require("../config/database");

class LogModel {
  /**
   * Creates a new log entry for a specific check.
   * @param {object} logData - Contains check_id, status, status_code, response_time_ms.
   * @returns {Promise<object>} The newly created log object.
   */

  static async create({ check_id, status, statusCode, responseTime }) {
    const { rows } = await pool.query(
      `INSERT INTO check_logs (check_id, status, status_code, response_time_ms)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
      [check_id, status, statusCode, responseTime]
    );
    return rows[0];
  }

  // Finds all log entries for a specific check, ordered from newest to oldest
  static async findByCheckId(check_id) {
    const { rows } = await pool.query(
      `SELECT * FROM check_logs
             WHERE check_id = $1
             ORDER BY created_at DESC
             LIMIT 100`,
      [check_id]
    );
    return rows;
  }
}

module.exports = LogModel;

const pool = require("../config/database");

class CheckModel {
  /**
   * Creates a new check for a specific user.
   * @param {object} checkData - Contains user_id, name, url, and interval.
   * @returns {Promise<object>} The newly created check object.
   */

  static async create({ user_id, name, url, interval_minutes }) {
    const { rows } = await pool.query(
      `INSERT INTO checks (user_id, name, url, interval_minutes)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
      [user_id, name, url, interval_minutes]
    );
    return rows[0];
  }

  /**
   * Finds all checks that belong to a specific user.
   * @param {string} user_id - The user's UUID.
   * @returns {Promise<Array<object>>} An array of the user's checks.
   */

  static async findByUserId(user_id) {
    const { rows } = await pool.query(
      "SELECT * FROM checks WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return rows;
  }

  // Finds all checks in the database to be processed by the monitoring engine.
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM checks");
    return rows;
  }

  /**
   * Updates the status and last_checked_at timestamp for a specific check.
   * @param {string} check_id - The ID of the check to update.
   * @param {string} status - The new status ('Up' or 'Down').
   * @returns {Promise<object>} The updated check object.
   */

  static async updateStatus(check_id, status) {
    const { rows } = await pool.query(
      `UPDATE checks
        SET current_status = $1, last_checked_at = NOW()
        WHERE check_id = $2
        RETURNING *`,
      [status, check_id]
    );
    return rows[0];
  }

  // Finds a single check by its ID, but only if it belongs to the specified user.
  static async findByIdAndUserId(check_id, user_id) {
    const { rows } = await pool.query(
      "SELECT * FROM checks WHERE check_id = $1 AND user_id = $2",
      [check_id, user_id]
    );
    return rows[0];
  }

  static async deleteByIdAndUserId(check_id, user_id) {
    const { rows } = await pool.query(
      "DELETE FROM checks WHERE check_id = $1 AND user_id = $2 RETURNING *",
      [check_id, user_id]
    );
    return rows[0];
  }

  static async update(check_id, user_id, { name, url, interval_minutes }) {
    const { rows } = await pool.query(
      `UPDATE checks
             SET name = $1, url = $2, interval_minutes = $3
             WHERE check_id = $4 AND user_id = $5
             RETURNING *`,
      [name, url, interval_minutes, check_id, user_id]
    );
    return rows[0];
  }
}

module.exports = CheckModel;

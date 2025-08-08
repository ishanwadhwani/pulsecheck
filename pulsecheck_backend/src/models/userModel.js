const pool = require("../config/database");

class UserModel {
  /**
   * Finds a user in the database by their email address.
   * @param {string} email - The email of the user to find.
   * @returns {Promise<object|undefined>} The user object if found, otherwise undefined.
   */

  static async findByEmail(email) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      return rows[0]; // Return the first user found, or undefined if none
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  /**
   * Creates a new user in the database.
   * @param {string} email - The user's email.
   * @param {string} password_hash - The user's BCRYPT-HASHED password.
   * @returns {Promise<object>} The newly created user object (without the password).
   */

  static async create(email, password_hash) {
    try {
      const { rows } = await pool.query(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING user_id, email, created_at",
        [email, password_hash]
      );
      return rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  /**
   * Finds a user in the database by their unique ID.
   * @param {string} id - The UUID of the user to find.
   * @returns {Promise<object|undefined>} The user object if found, otherwise undefined.
   */
  static async findById(id) {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE user_id = $1",
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }
}

module.exports = UserModel;

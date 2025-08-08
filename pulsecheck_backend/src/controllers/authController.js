const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

class AuthController {
  // Logic for registering a new user

  static async register(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long.",
      });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "A user with this email already exists.",
        });
      }
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Create the new user in the database
      const newUser = await UserModel.create(email, password_hash);
      return res.status(201).json({
        message: "User registered successfully.",
        user: {
          user_id: newUser.user_id,
          email: newUser.email,
          // created_at: newUser.created_at
        },
      });
    } catch (error) {
      console.error("Error during user registration:", error);
      return res.status(500).json({
        message: "An error occurred while registering the user.",
      });
    }
  }

  // logging in an existing user
  static async login(req, res) {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }
    try {
        // Find user in DB
        const user = await UserModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid email or password."
            });
        }
        // Generate JWT token if credentials are valid
        const payload = {
            user: {
                id: user.user_id,
                email: user.email
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' }, // Token expires in 7 days
            (err, token) => {
                if (err) throw err;

                res.json({ token });
            }
        );
    } catch (error) {
        console.error("Error during user login:", error);
        return res.status(500).json({
            message: "An error occurred while logging in.",
        });
    }
  }
}


module.exports = AuthController;
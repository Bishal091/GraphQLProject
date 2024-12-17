const jwt = require("jsonwebtoken");
require("dotenv").config(); // Load environment variables from .env file

module.exports = {
  generateToken: (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "48h" });
  },
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error("Invalid token");
    }
  },
};
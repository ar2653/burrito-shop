require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if user exists in DB, if exists, throw error else continue
    // Hash the password to store in DB
    const hash = await bcrypt.hash(password, 10);
    // Store user, in users table
    res
      .status(201)
      .json({
        data: { email: email, password: hash },
        message: "User registered successfully",
      });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find the user from DB
        // If user exists, check password hash from db
        // Generate the JWT Token
        const token = await jwt.sign({ email }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;

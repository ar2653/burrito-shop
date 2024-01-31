require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sql = require("../db");

// Register a user
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email_address, password } = req.body;
    // check if user exists in DB, if exists, throw error else continue
    const checkUserQuery = "SELECT * FROM users WHERE email_address = ?";
    const [existingUsers, fields] = await sql
      .promise()
      .query(checkUserQuery, [email_address]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password to store in DB
    try {
      const hash = await bcrypt.hash(password, 10);
      const insertQuery = `INSERT INTO users (first_name, last_name, email_address, password_hash) VALUES (?, ?, ?, ?)`;
      const insertValues = [first_name, last_name, email_address, hash];
      const [insertResults, _] = await sql
        .promise()
        .query(insertQuery, insertValues);
      if (insertResults.affectedRows > 0) {
        const lastInsertedId = insertResults.insertId;
        res.status(201).json({
          data: {
            user_id: lastInsertedId,
            first_name: first_name,
            last_name: last_name,
            email_address: email_address,
          },
          message: "User registered successfully",
        });
      } else {
        res.status(500).json({ message: "Failed to register user" });
      }
    } catch (insertError) {
      res.status(400).json({ message: "Failed to insert user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/login", async (req, res) => {
  try {
    const { email_address, password } = req.body;
    // Find the user from DB
    const findUserQuery = "SELECT * FROM users WHERE email_address = ?";
    const [users, fields] = await sql
      .promise()
      .query(findUserQuery, [email_address]);
    // Check if the user exists
    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    // If user exists, check password hash from db
    const user = users[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    // If passwords do not match, return an unauthorized
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // If passwords match, generate a JWT token
    const token = jwt.sign(
      { user_id: user.id, email: user.email_address },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

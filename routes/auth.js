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
      console.log(existingUsers);
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
      console.log("After inserting into database");
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
    const { email, password } = req.body;
    // Find the user from DB
    // If user exists, check password hash from db
    // Generate the JWT Token
    const token = await jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

require("dotenv").config();
const mysql = require("mysql2");

let config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

if (process.env.NODE_ENV === "test") {
  config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  };
}

// Creating a sql pool with db details
const sql = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  connectTimeout: 20000, // 20 seconds
});

module.exports = sql;

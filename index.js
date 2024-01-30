require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = process.env.PORT || 4001;
const verifyToken = require("./authenticator.js");

// routes
const shop = require("./routes/shop");
const auth = require("./routes/auth");

// Logger for all the api calls
app.use((req, res, next) => {
  const now = new Date();
  console.log(`${now.toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Burrito Shop");
});

app.get("/test", (req, res, next) => {
  res.send("Server is up and running");
});

// All routes go thru verification except auth
app.use("/auth", auth);
app.use(verifyToken);
app.use("/api", shop);
/**
 * 404 middlware
 */
app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

// Start server
app.listen(port, () => {
  console.log(`Burrito-shop app listening on port ${port}`);
});

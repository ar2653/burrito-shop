const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/authenticator");
const shop = require("../routes/shop");
const app = express();
const bodyParser = require("body-parser");
const { existingUser } = require("../__mocks__/mockusers");

// const { newRegisteredUser } = require("../__mocks__/mockusers");
// const { emptyOrder, subtotalCalculator, buildBulkInsertQuery, reduceIndividualOrders, updateToppingsData } = require("../utils/helper");
// const queries = require('../utils/queries');
// const sql = require("../db");
// const order = require("../__mocks__/orderdata");
app.use(verifyToken);
app.use("/api", shop);
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Create express app
// const app = express();
// app.use(express.json());
// // use authenticator middleware

process.env.JWT_SECRET_KEY = "secret";

describe("Shop.js", () => {
  describe("GET ALL", () => {
    const token = jwt.sign(
      { user_id: 1, email: "ankush@gmail.com" },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    test("burritos", async () => {
      const res = await request(app)
        .get("/api/burrito")
        .set("Authorization", token)
        .expect(200);
      expect(res.body.message).toStrictEqual("Burritos retrieved successfully");
    });
    test("toppings", async () => {
      const res = await request(app)
        .get("/api/toppings")
        .set("Authorization", token)
        .expect(200);
      expect(res.body.message).toStrictEqual("toppings retrieved successfully");
    });

    test("order details", async () => {
      const orderId = 10;
      const res = await request(app)
        .get(`/api/orders/${orderId}`)
        .set("Authorization", token)
        .expect(200);
      expect(res.body.message).toStrictEqual("success");
    });

    test("new order", async () => {
      app.use(verifyToken);
      const res = await request(app)
        .post("/api/order")
        .set("Authorization", token)
        .send(existingUser)
        .expect(200);
      expect(res.body.message).toStrictEqual("success");
    });
  });
});

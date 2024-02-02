const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/authenticator");
const shop = require("../routes/shop");
const app = express();
const bodyParser = require("body-parser");
const { placeOrder, mockOrderDetails } = require("../__mocks__/orderdata");
const { userPayload } = require("../__mocks__/mockusers");
const sql = require("../db");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(verifyToken);
app.use("/api", shop);

process.env.JWT_SECRET_KEY = "secret";

describe("Shop.js", () => {
  describe("GET ALL", () => {
    const token = jwt.sign(
      userPayload,
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
      const res = request(app)
        .post("/api/order")
        .set("Authorization", token)
        .send(placeOrder)
        .expect(200);
      const response = await res;
      expect(response.body.message).toStrictEqual("Order confirmed");
    });
  });
  describe('GET /orders/:orderId', () => {
    test('should handle multiple items with the same order_id and id', async () => {
      const token = jwt.sign(
        userPayload,
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      sql.promise().query = jest.fn().mockResolvedValueOnce([mockOrderDetails]);
      const response = await request(app).get('/api/orders/14').set("Authorization", token);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('success');
    });
  });
});

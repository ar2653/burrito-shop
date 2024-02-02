const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../utils/authenticator");
const shop = require("../routes/shop");
const app = express();
const bodyParser = require("body-parser");
const { existingUser } = require("../__mocks__/mockusers");
const queries = require("../utils/queries");
const sql = require("../db");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(verifyToken);
app.use("/api", shop);

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
      const res = request(app)
        .post("/api/order")
        .set("Authorization", token)
        .send({
          orderData: [
            {
              product_id: 1,
              quantity: 2,
              toppings: [3, 4],
            },
            {
              product_id: 20,
              quantity: 2,
              toppings: [3, 4],
            },
          ],
        })
        .expect(200);
      const response = await res;
      expect(response.body.message).toStrictEqual("Order confirmed");
    });
  });
  describe('GET /orders/:orderId', () => {
    test('should handle multiple items with the same order_id and id', async () => {
      const mockOrderDetails = [
        {
          order_id: 14,
          id: 27,
          first_name: 'Ankush',
          order_date: '2024-01-31T05:00:00.000Z',
          product_name: 'Chicken Burrito',
          product_size: 'Small',
          product_price: '3.00',
          quantity: 2,
          topping_name: 'Cheese, Salsa',
          topping_price: 1.5,
        },
        {
          order_id: 14,
          id: 27, // Same id as the previous item
          first_name: 'Ankush',
          order_date: '2024-01-31T05:00:00.000Z',
          product_name: 'Chicken Burrito',
          product_size: 'Small',
          product_price: '3.00',
          quantity: 2,
          topping_name: 'Cheese, Salsa',
          topping_price: 1.5,
        },
      ];
      const token = jwt.sign(
        { user_id: 1, email: "ankush@gmail.com" },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      sql.promise().query = jest.fn().mockResolvedValueOnce([mockOrderDetails]);
      const response = await request(app).get('/api/orders/14').set("Authorization", token);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('success');
      expect(response.body.data.length).toBeGreaterThan(1);
    });
  });
});

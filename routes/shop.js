const express = require("express");
const router = express.Router();
const sql = require("../db");

const abcFinal = async (orderData) => {
  const order_id = await emptyOrderFunction(); // returns order id
  const individualOrders = await subtotalCalculator(order_id, orderData);
  const insertQuery = await generateInsertQuery(individualOrders);
  // insert sql step
  // calculate total price and update order table
  // return order object with totals
};

router.post('/createOrder', (req, res) => {
  try {
    
  } catch (error) {
    
  }
})
// Create an empty order
// router.post("/emptyOrder", async (req, res) => {
//   try {
//     const { user_id } = req.user,
//       order_date = new Date();
//     const [emptyOrder, _] = await sql
//       .promise()
//       .query("INSERT INTO orders (user_id, order_date) VALUES (?, ?)", [
//         user_id,
//         order_date,
//       ]);
//     const order_id = emptyOrder.insertId;
//     res.status(201).json({ order_id });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server Error" });
//   }
// });

router.post("/order-detail", async (req, res) => {
  try {
  } catch (error) {}
});

// We need
router.get("/", async (req, res) => {
  res.status(200).json({ data: "shop", message: "shop page" });
});

// Get all toppings
router.get("/toppings", async (req, res) => {
  try {
    const query = "SELECT * FROM toppings";
    const [toppings, _] = await sql.promise().query(query);
    res.status(200).json(toppings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;

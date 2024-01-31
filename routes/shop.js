const express = require("express");
const router = express.Router();
const sql = require("../db");
const { emptyOrder, subtotalCalculator, generateInsertQuery, reduceIndividualOrders } = require("../utils/helper");

router.post('/createOrder', async (req, res) => {
  try {
    const { order_data } = req.body;
    const order_id = await emptyOrder(req);
    const individualOrders = await subtotalCalculator(order_id, order_data);
    const orderTotal = await reduceIndividualOrders(individualOrders);
    const insertQuery = await generateInsertQuery(order_id, individualOrders);
    const [order_details_data, _] = await sql.promise().query(insertQuery.query, insertQuery.values);
    const updateTotalPriceQuery = 'UPDATE orders SET total_amount = ? WHERE order_id = ?';
    const [updateResult] = await sql.promise().query(updateTotalPriceQuery, [orderTotal, order_id]);
    const orderConfirmed = await sql.promise().query(`SELECT * from orders where order_id = ${order_id}`);
    console.log('Update Result:', updateResult, orderConfirmed);
    res.status(200).json({message: "Order confirmed"});
  } catch (error) {
    console.log(error);
  }
})

module.exports = router;

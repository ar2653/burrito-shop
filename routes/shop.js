const express = require("express");
const router = express.Router();
const sql = require("../db");
const { emptyOrder, subtotalCalculator, buildBulkInsertQuery, reduceIndividualOrders } = require("../utils/helper");
const queries = require('../utils/queries');

router.post('/order', async (req, res) => {
  try {
    const orderId = await emptyOrder(req);
    const individualOrders = await subtotalCalculator(orderId, req);
    const orderTotal = await reduceIndividualOrders(individualOrders);
    const bulkInsert = await buildBulkInsertQuery(orderId, individualOrders);
    await sql.promise().query(bulkInsert.query, bulkInsert.values);
    await sql.promise().query(queries.UPDATE_ORDER_PRICE, [orderTotal, orderId]);
    const [ orderDetails ] = await sql.promise().query(queries.GET_CONFIRMED_ORDER_DETAILS, [orderId]);
    res.status(200).json({data: orderDetails, message: "Order confirmed"});
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

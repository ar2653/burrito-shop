const express = require("express");
const router = express.Router();
const sql = require("../db");
const { emptyOrder, subtotalCalculator, buildBulkInsertQuery, reduceIndividualOrders } = require("../utils/helper");
const queries = require('../utils/queries');

/**
 * Process an order, including calculating subtotals, updating order details, and confirming the order.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
router.post('/order', async (req, res) => {
  try {
    // Get the order ID from the empty order function
    const orderId = await emptyOrder(req);
    // Calculate individual order subtotals
    const individualOrders = await subtotalCalculator(orderId, req);
    // Calculate the total order amount
    const orderTotal = await reduceIndividualOrders(individualOrders);
    // Build a bulk insert query for order details
    const bulkInsert = await buildBulkInsertQuery(orderId, individualOrders);
    // Insert order details into the database
    await sql.promise().query(bulkInsert.query, bulkInsert.values);
    // Update the total amount of the order
    await sql.promise().query(queries.UPDATE_ORDER_PRICE, [orderTotal, orderId]);
    // Retrieve confirmed order details
    const [orderDetails] = await sql.promise().query(queries.GET_CONFIRMED_ORDER_DETAILS, [orderId]);
    // Respond with the confirmed order details and a success message
    res.status(200).json({ data: orderDetails, message: "Order confirmed" });
  } catch (error) {
    console.log(error);
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const sql = require("../db");
const { emptyOrder, subtotalCalculator, buildBulkInsertQuery, reduceIndividualOrders, updateToppingsData } = require("../utils/helper");
const queries = require('../utils/queries');

/**
 * Process an order, including calculating subtotals, updating order details, and confirming the order.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
router.post('/order', async (req, res) => {
  try {
    // console.log("ENTERED1", req);
    const orderId = await emptyOrder(req);
    console.log("orderId", orderId);
    const individualOrders = await subtotalCalculator(orderId, req);
    const orderTotal = await reduceIndividualOrders(individualOrders);
    const bulkInsert = await buildBulkInsertQuery(orderId, individualOrders);
    await sql.promise().query(bulkInsert.query, bulkInsert.values);
    await sql.promise().query(queries.UPDATE_ORDER_PRICE, [orderTotal, orderId]);
    const toppingsUpdate = await updateToppingsData(req, orderId);
    const [orderDetails] = await sql.promise().query(queries.GET_CONFIRMED_ORDER_DETAILS, [orderId]);
    res.status(200).json({ data: orderDetails, message: "Order confirmed" });
  } catch (error) {
    console.log(error);
  }
});

/**
 * Retrieve a list of all burrito products.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
router.get('/burrito', async (req, res) => {
  try {
    const [products] = await sql.promise().query(queries.SELECT_PRODUCTS);
    res.status(200).json({ data: products, message: "Burritos retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * Retrieve a list of all toppings
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
router.get('/toppings', async (req, res) => {
  try {
    const [toppings] = await sql.promise().query(queries.SELECT_TOPPINGS);
    res.status(200).json({ data: toppings, message: "toppings retrieved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * Retrieve details of a specific order by order ID.
 * @param {Object} req - Express request object containing the order ID as a parameter.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    const [orderDetails] = await sql.promise().query(queries.GET_ORDER_DETAILS, [orderId]);
    const transformedResponse = {
      data: Object.values(orderDetails.reduce((acc, item) => {
        const key = `${item.order_id}-${item.id}`;
        if (!acc[key]) {
          acc[key] = { ...item, topping_name: [item.topping_name], topping_price: parseFloat(item.topping_price) };
        } else {
          acc[key].topping_name.push(item.topping_name);
          acc[key].topping_price += parseFloat(item.topping_price);
        }
        return acc;
      }, {})).map(combinedItem => {
        combinedItem.topping_name = combinedItem.topping_name.join(', ');
        return combinedItem;
      })
    };
    res.status(200).json({data: transformedResponse.data, message: "success"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});





module.exports = router;

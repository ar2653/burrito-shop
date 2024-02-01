const sql = require("../db");
const queries = require("./queries");

/**
 * Creates an empty order for a user.
 *
 * @async
 * @param {Object} req - The request object containing user information.
 * @param {number} req.user.user_id - The user ID.
 * @returns {Promise<number>} The order ID of the newly created empty order.
 * @throws {Error} Throws an error if the query execution fails.
 */
const emptyOrder = async (req) => {
  try {
    const { user_id } = req.user;
    const order_date = new Date();
    const [emptyOrder, _] = await sql
      .promise()
      .query(queries.INSERT_ORDER, [
        user_id,
        order_date,
      ]);
    const orderId = emptyOrder.insertId;
    return orderId;
  } catch (error) {
    console.error(`Error executing SQL query for emptyOrder: ${error.message}`);
    throw error;
  }
};

/**
 * Calculates subtotal for each order detail based on the data.
 *
 * @async
 * @function
 * @param {number} orderId - The ID of the empty order.
 * @param {Array} data - An array of order details from request body.
 * @returns {Promise<Array>} An array of objects containing order details with subtotals.
 * @throws {Error} Throws an error if there is an issue with the SQL queries or data processing.
 */
const subtotalCalculator = async (orderId, req) => {
  const data = req.body.orderData;
  const [toppings, toppingFields] = await sql
    .promise()
    .query(queries.SELECT_TOPPINGS);
  const [products, productFields] = await sql
    .promise()
    .query(queries.SELECT_PRODUCTS);
  const toppingsLookup = toppings.reduce((lookup, topping) => {
    lookup[topping.id] = parseFloat(topping.price);
    return lookup;
  }, {});
  const productsLookup = products.reduce((lookup, product) => {
    lookup[product.id] = {
      name: product.name,
      price: parseFloat(product.price) || 0,
    };
    return lookup;
  }, {});
  return data.map((orderDetail) => {
    const product = productsLookup[orderDetail.product_id];
    const toppingsArray = orderDetail.toppings.map(
      (toppingId) => toppingsLookup[toppingId] || 0
    );
    const toppingsPrice = toppingsArray.reduce(
      (acc, toppingPrice) => acc + toppingPrice,
      0
    );
    const subtotal = orderDetail.quantity * (product.price + toppingsPrice);
    return {
      orderId: orderId,
      product_id: orderDetail.product_id,
      quantity: orderDetail.quantity,
      subtotal: subtotal,
    };
  });
};

/**
 * Reduces an array of order details to calculate the total sum of subtotals.
 *
 * @function
 * @param {Array} orderDetails - An array of order details with subtotals.
 * @returns {number} The total sum of subtotals.
 */
const reduceIndividualOrders = (orderDetails) => {
  return orderDetails.reduce((totalSum, orderDetail) => {
    return totalSum + orderDetail.subtotal;
  }, 0);
};

/**
 * Generates Query and values for inserting multiple order details into the order_details table.
 *
 * @function
 * @param {number} orderId - The order id to associate with the inserted order details.
 * @param {Array} data - An array of order details containing product_id, quantity, and subtotal.
 * @returns {Object} An object containing the SQL query and values for insertion.
 * @throws {Error} Throws an error if the provided data is not valid.
 */
const buildBulkInsertQuery = (orderId, data) => {
  const valuesPlaceholder = data.map(() => "(?, ?, ?, ?)").join(", ");
  const query = `${queries.INSERT_ORDER_DETAILS_BULK} ${valuesPlaceholder}`;
  const values = data.flatMap((orderDetail) => [
    orderId,
    orderDetail.product_id,
    orderDetail.quantity,
    orderDetail.subtotal,
  ]);
  return { query, values };
};

module.exports = {
  emptyOrder,
  subtotalCalculator,
  reduceIndividualOrders,
  buildBulkInsertQuery,
};

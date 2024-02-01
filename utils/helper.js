const sql = require("../db");
const queries = require("./queries");

/**
 * Create an empty order for a user.
 *
 * @param {Object} req - Express request object.
 * @returns {Promise<number>} - Promise resolving to the order ID.
 * @throws {Error} - Throws an error if the SQL query fails.
 */
const emptyOrder = async (req) => {
  try {
    const { user_id } = req.user;
    const order_date = new Date();
    const [emptyOrder, _] = await sql
      .promise()
      .query(queries.INSERT_ORDER, [user_id, order_date]);
    const orderId = emptyOrder.insertId;
    return orderId;
  } catch (error) {
    console.error(`Error executing SQL query for emptyOrder: ${error.message}`);
    throw error;
  }
};

/**
 * Calculate subtotals for individual order details.
 *
 * @param {number} orderId - The ID of the order.
 * @param {Object} req - Express request object.
 * @returns {Array<Object>} - Array of objects representing order details with subtotals.
 * @throws {Error} - Throws an error if the SQL queries fail.
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
 * Calculate total sum of subtotals in order details.
 * @param {Object[]} orderDetails - Array of objects representing order details.
 * @returns {number} - Total sum of subtotals.
 */
const reduceIndividualOrders = (orderDetails) =>
  orderDetails.reduce((total, { subtotal }) => total + subtotal, 0);

/**
 * Build a bulk insert query for order details.
 * @param {number} orderId - Order ID.
 * @param {Object[]} data - Array of objects representing order details.
 * @returns {Object} - Query object with 'query' and 'values' properties.
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

const updateToppingsData = async (req, orderId) => {
  console.log(`${queries.SELECT_ORDER_DETAILS_BY_ORDER_ID}${orderId}`);
  const combinations = [];
  const [orderDetails, _] = await sql
    .promise()
    .query(`${queries.SELECT_ORDER_DETAILS_BY_ORDER_ID}`, [orderId]);
  console.log(req.body.orderData, orderDetails);
  for (const orderItem of req.body.orderData) {
    const matchingDetailItems = orderDetails.filter(
      (detail) => detail.product_id === orderItem.product_id
    );
    for (const detailItem of matchingDetailItems) {
      for (const toppingId of orderItem.toppings) {
        combinations.push({
          id_from_details: detailItem.id,
          topping_id: toppingId,
        });
      }
    }
  }
  const valuesPlaceholder = combinations.map(() => "(?, ?)").join(", ");
  const query = `INSERT INTO item_toppings (order_detail_id, topping_type_id) VALUES ${valuesPlaceholder}`;
  const values = combinations.flatMap((combination) => [
    combination.id_from_details,
    combination.topping_id,
  ]);
  const updatedtopps = await sql.promise().query(query, values);
  console.log(updatedtopps, "updatedtoppsupdatedtoppsupdatedtopps");
};

module.exports = {
  emptyOrder,
  subtotalCalculator,
  reduceIndividualOrders,
  buildBulkInsertQuery,
  updateToppingsData
};
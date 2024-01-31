const sql = require("../db");

const emptyOrder = async (req) => {
  try {
    const { user_id } = req.user;
    const order_date = new Date();
    const [emptyOrder, _] = await sql
      .promise()
      .query("INSERT INTO orders (user_id, order_date) VALUES (?, ?)", [
        user_id,
        order_date,
    ]);
    const order_id = emptyOrder.insertId;
    return order_id;
  } catch (error) {
    console.error(error);
  }
};
const subtotalCalculator = async (order_id, data) => {
  const [toppings, toppingFields] = await sql
    .promise()
    .query("SELECT * FROM toppings");
  const [products, productFields] = await sql
    .promise()
    .query("SELECT * FROM products");
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
      order_id: order_id,
      product_id: orderDetail.product_id,
      quantity: orderDetail.quantity,
      subtotal: subtotal,
    };
  });
};

// total sum
const reduceIndividualOrders = (orderDetails) => {
    return orderDetails.reduce((totalSum, orderDetail) => {
      return totalSum + orderDetail.subtotal;
    }, 0);
};

// Insert each item into order detail
const generateInsertQuery = (order_id, data) => {
  const valuesPlaceholder = data.map(() => "(?, ?, ?, ?)").join(", ");
  const query = `INSERT INTO order_details (order_id, product_id, quantity, subtotal_price) VALUES ${valuesPlaceholder}`;
  const values = data.flatMap((orderDetail) => [
    order_id,
    orderDetail.product_id,
    orderDetail.quantity,
    orderDetail.subtotal,
  ]);
  return { query, values };
};

module.exports = { emptyOrder, subtotalCalculator, reduceIndividualOrders, generateInsertQuery };

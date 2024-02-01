const queries = {
  UPDATE_ORDER_PRICE: "UPDATE orders SET total_amount = ? WHERE order_id = ?",
  GET_CONFIRMED_ORDER_DETAILS: "SELECT * from ORDERS WHERE order_id = ?",
  SELECT_USER_BY_EMAIL: "SELECT * FROM users WHERE email_address = ?",
  INSERT_USER:
    "INSERT INTO users (first_name, last_name, email_address, password_hash) VALUES (?, ?, ?, ?)",
  INSERT_ORDER: "INSERT INTO orders (user_id, order_date) VALUES (?, ?)",
  SELECT_TOPPINGS: "SELECT * FROM toppings",
  SELECT_PRODUCTS: "SELECT * FROM products",
  INSERT_ORDER_DETAILS_BULK:
    "INSERT INTO order_details (order_id, product_id, quantity, subtotal_price) VALUES",
  INSERT_ITEM_TOPPINGS:
    "INSERT INTO item_toppings (order_detail_id, topping_type_id) VALUES (?, ?)",
  SELECT_ORDER_DETAILS_BY_ORDER_ID:
    "SELECT * FROM ORDER_DETAILS WHERE order_id = ?",
  GET_ORDER_DETAILS: `SELECT
    o.order_id,
    od.id,
    u.first_name,
    o.order_date,
    p.name AS product_name,
    p.size AS product_size,
    p.price AS product_price,
    od.quantity,
    t.item AS topping_name,
    t.price AS topping_price
  FROM
    orders o
  JOIN
    users u ON o.user_id = u.user_id
  JOIN
    order_details od ON o.order_id = od.order_id
  JOIN
    products p ON od.product_id = p.id
  LEFT JOIN
    item_toppings it ON od.id = it.order_detail_id
  LEFT JOIN
    toppings t ON it.topping_type_id = t.id
  WHERE
    o.order_id = ?`,
};
module.exports = queries;

const queries = {
    UPDATE_ORDER_PRICE: "UPDATE orders SET total_amount = ? WHERE order_id = ?",
    GET_CONFIRMED_ORDER_DETAILS: "SELECT * from ORDERS WHERE order_id = ?",
    SELECT_USER_BY_EMAIL: 'SELECT * FROM users WHERE email_address = ?',
    INSERT_USER: 'INSERT INTO users (first_name, last_name, email_address, password_hash) VALUES (?, ?, ?, ?)',
    INSERT_ORDER: 'INSERT INTO orders (user_id, order_date) VALUES (?, ?)',
    SELECT_TOPPINGS: 'SELECT * FROM toppings',
    SELECT_PRODUCTS: 'SELECT * FROM products',
    INSERT_ORDER_DETAILS_BULK: 'INSERT INTO order_details (order_id, product_id, quantity, subtotal_price) VALUES',
}
module.exports = queries;

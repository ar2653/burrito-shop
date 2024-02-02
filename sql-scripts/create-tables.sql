-- Create database if not exists
-- DROP DATABASE burritodb;
CREATE DATABASE burritodb1;
USE burritodb1;

-- USERS
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email_address VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL
);

-- ORDERS
CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  order_date DATE,
  total_amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- PRODUCTS
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  size VARCHAR(10),
  price DECIMAL(10, 2)
);

-- TOPPINGS
CREATE TABLE toppings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item VARCHAR(255),
  price DECIMAL(10, 2)
);

-- ORDER_DETAILS
CREATE TABLE order_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  subtotal_price DECIMAL(10, 2),
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ITEM_TOPPINGS
CREATE TABLE item_toppings (
  order_detail_id INT,
  topping_type_id INT,
  PRIMARY KEY (order_detail_id, topping_type_id),
  FOREIGN KEY (order_detail_id) REFERENCES order_details(id),
  FOREIGN KEY (topping_type_id) REFERENCES toppings(id)
);

-- Dummy user
INSERT INTO users (first_name, last_name, email_address, password_hash)
VALUES
('John', 'Doe', 'johndoe@gmail.com', 'hashed_password');

-- Products
INSERT INTO products (name, size, price)
VALUES
  ('Chicken Burrito', 'Small', 3.00),
  ('Chicken Burrito', 'Medium', 4.00),
  ('Chicken Burrito', 'Regular', 5.00),
  ('Chicken Burrito', 'Large', 6.00),
  ('Chicken Burrito', 'XL', 7.00),
  
  ('Beef Burrito', 'Small', 3.50),
  ('Beef Burrito', 'Medium', 4.50),
  ('Beef Burrito', 'Regular', 5.50),
  ('Beef Burrito', 'Large', 6.50),
  ('Beef Burrito', 'XL', 7.50),
  
  ('Veggie Burrito', 'Small', 3.25),
  ('Veggie Burrito', 'Medium', 4.25),
  ('Veggie Burrito', 'Regular', 5.25),
  ('Veggie Burrito', 'Large', 6.25),
  ('Veggie Burrito', 'XL', 7.25),
  
  ('Steak Burrito', 'Small', 4.00),
  ('Steak Burrito', 'Medium', 5.00),
  ('Steak Burrito', 'Regular', 6.00),
  ('Steak Burrito', 'Large', 7.00),
  ('Steak Burrito', 'XL', 8.00);

-- Toppings
INSERT INTO toppings (item, price)
VALUES
  ('Guacamole', 1.50),
  ('Sour Cream', 0.75),
  ('Cheese', 1.00),
  ('Salsa', 0.50),
  ('Jalapenos', 0.75);

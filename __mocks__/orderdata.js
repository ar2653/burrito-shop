const order = {
  orderData: [
    {
      product_id: 1,
      quantity: 1,
      toppings: [3, 4],
    },
    {
      product_id: 20,
      quantity: 2,
      toppings: [3, 4],
    },
  ],
};

const subTotalArray = [{ subtotal: 10 }, { subtotal: 20 }, { subtotal: 30 }];

const orderData = [
  { product_id: 1, quantity: 2, subtotal: 10 },
  { product_id: 2, quantity: 3, subtotal: 15 },
];

const placeOrder = {
  orderData: [
    {
      product_id: 1,
      quantity: 3,
      toppings: [1, 3, 4],
    },
    {
      product_id: 20,
      quantity: 4,
      toppings: [3, 4],
    },
  ],
};

const mockOrderDetails = [
  {
    order_id: 1,
    id: 1,
    first_name: 'John',
    order_date: '2024-01-31T05:00:00.000Z',
    product_name: 'Chicken Burrito',
    product_size: 'Small',
    product_price: '3.00',
    quantity: 2,
    topping_name: 'Cheese, Salsa',
    topping_price: 1.5,
  },
  {
    order_id: 1,
    id: 1,
    first_name: 'John',
    order_date: '2024-01-31T05:00:00.000Z',
    product_name: 'Chicken Burrito',
    product_size: 'Small',
    product_price: '3.00',
    quantity: 2,
    topping_name: 'Cheese, Salsa',
    topping_price: 1.5,
  },
];

module.exports = {
  order,
  subTotalArray,
  orderData,
  placeOrder,
  mockOrderDetails
};

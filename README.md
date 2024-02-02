# Burrito Shop Orders Management Backend Application

### About the Project

This Node.js and Express.js application manages orders for a burrito shop. It uses a MySQL database, and Jest is employed for writing test cases. The backend and databases can be run both on docker or in your local machine.

### Features
1. **User Registration**
2. **Login Functionality**
3. **Secure Authentication mechanism using JWT Tokens**
4. **Create a new order**
5. **View all burritos**
6. **View all toppings**
7. **Ability to add multiple burritos and toppings**
8. **Robust test suite**
9. **Containerized using Docker** 

### Testing the app
#### Things to do:
1. Make sure you have docker installed on your computer. Verify it using ```docker --version```
2. Clone the repository: ```git clone <repository_url>```
3. Run ```docker-compose up``` in terminal
4. Check status by opening docker application or check in terminal using ```docker ps```.
5. Verify if backend application is up and running by going to ```localhost:4000/test``` in your browser.
6. Test the other API'S using any REST Client. You can find the postman collection below.


### Getting Started for Development

1.  **Clone the Repository:** ```git clone <repository_url>```
2. **Install Dependencies:** ```npm install```
3. **Run in Development Mode:** ```npm run dev```
4. **Run in Production Mode:**```npm run start```
5. **Create sample DB in mysql:** ``` Run the sql-scripts.sql```
6. **Run Tests:**```npm run test```
7. **Coverage report:** ```npm run test:coverage```
---
### Relationship between the entities

![Database ER diagram (crow's foot)](https://github.com/ar2653/burrito-shop/assets/144984108/c71c3a54-b1a7-4213-a3c8-4cc44890f91d)

## Postman Collection Documentation: Burrito Shop API

### Link: 
``` https://elements.getpostman.com/redirect?entityId=32670627-49649700-51ed-4b51-8c48-4adecdd1d4ed&entityType=collection```

### Overview

This Postman collection provides a set of APIs for interacting with the Burrito Shop application. The collection includes endpoints for user registration, user login, order creation, retrieving burrito details, fetching toppings information, and getting details of a specific order.

### Authorization

To access certain endpoints, a valid JWT token must be included in the request headers. Use the token obtained after successful user login.

### 1. Register User

- **Endpoint:** `POST /auth/register`

  **Request:**
  ```json
  {
      "firstName": "Alice",
      "lastName": "Johnson",
      "emailAddress": "alice.johnson@example.com",
      "password": "securepassword"
  }

**Response:**
User registration successful

### 2. User Login

- **Endpoint:** `POST /auth/login`

  **Request:**
  ```json
  {
      "email_address": "alice.johnson@example.com",
      "password": "securepassword"
  }
  
**Response:**
Successful login response with a JWT token

### 3. Create New Order

- **Endpoint:** `POST /api/order`

  **Request:**
  ```json
  {
      "orderData": [
          {
              "product_id": 2,
              "quantity": 2,
              "toppings": [1, 4]
          },
          {
              "product_id": 20,
              "quantity": 1,
              "toppings": [1, 3, 4]
          }
      ]
  }
  
**Authorization:**
- **Header:** `Authorization: <JWT Token>`

**Response:**
New order creation successful

### 4. Get List of Burritos

- **Endpoint:** `GET /api/burrito`

  **Authorization:**
  - **Header:** `Authorization: <JWT Token>`

  **Response:**
  List of available burritos

### 5. Get List of Toppings

- **Endpoint:** `GET /api/toppings`

  **Authorization:**
  - **Header:** `Authorization: <JWT Token>`

  **Response:**
  List of available toppings

### 6. Get Order Details by Order ID

- **Endpoint:** `GET /api/orders/:orderId`

  **Request:**
  - **URL Parameters:**
    - `:orderId` (replace with the generated order ID)

  **Authorization:**
  - **Header:** `Authorization: <JWT Token>`

  **Response:**
  Details of the specified order
---
### Sample Test coverage results for Burrito-API

<img width="797" alt="Screenshot 2024-02-01 at 11 29 02 PM" src="https://github.com/ar2653/burrito-shop/assets/144984108/7a226180-d828-4f2d-a711-eb788a11f43b">

Just the catch blocks in try...catch are leftout.

### Sample Docker containers

<img width="1461" alt="Screenshot 2024-02-02 at 6 23 10 AM" src="https://github.com/ar2653/burrito-shop/assets/144984108/b91bfb82-727a-4a6d-b8f5-9cdef3d048d0">

### The Node JS App and MySQL Database are published to docker hub as well.

<img width="1013" alt="Screenshot 2024-02-02 at 6 25 51 AM" src="https://github.com/ar2653/burrito-shop/assets/144984108/e4203e72-3b6a-4af1-bdc5-998a8eb5c636">

[Not Ready Yet]: There is some error when using these docker images. All the end points are not working as expected.

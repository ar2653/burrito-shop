// const jwt = require('jsonwebtoken');
// const supertest = require('supertest');
// const express = require('express');
// const verifyToken = require("../utils/authenticator");
// // Create express app
// const app = express();
// app.use(express.json());
// // use authenticator middleware
// app.use(verifyToken);

// // Dummy route to test the middleware
// app.get('/protected', (req, res) => {
//   res.status(200).json({ message: 'You have access!' });
// });

// // Mock environment variables
// process.env.JWT_SECRET_KEY = 'secret';

// describe('Token Verification Middleware', () => {
//   test('should allow access with a valid token', async () => {
//     const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
//     const response = await supertest(app)
//       .get('/protected')
//       .set('Authorization', token);
//     expect(response.status).toBe(200);
//     expect(response.body.message).toBe('You have access!');
//   });

//   test('should return 401 Unauthorized without a token', async () => {
//     const response = await supertest(app).get('/protected');
//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe('Unauthorized');
//   });

//   test('should return 401 Unauthorized with an invalid token', async () => {
//     // Create an invalid JWT token
//     const invalidToken = 'invalidToken';
//     const response = await supertest(app)
//       .get('/protected-route')
//       .set('Authorization', invalidToken);
//     expect(response.status).toBe(401);
//     expect(response.body.message).toBe('Invalid token');
//   });
// });

// afterAll(() => {
//   delete process.env.JWT_SECRET_KEY;
//   jest.resetAllMocks();
// });

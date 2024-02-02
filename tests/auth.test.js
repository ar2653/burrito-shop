const request = require("supertest");
const app = require("../index");
const {
  newRegisteredUser,
  existingUser,
  validLoginUser,
  invalidLoginUser,
  unauthorizedUser,
} = require("../__mocks__/mockusers");

describe("Authentication Endpoints", () => {
  // Registration test suite
  describe("User Registration", () => {
    // A new user is being registered
    test("Should successfully register a new user", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(newRegisteredUser)
        .expect(201);
      expect(res.body.message).toStrictEqual("User registered successfully");
    });
    // As the mock user is registered, this should throw 400
    test("Should throw error if existing user is registering", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send(existingUser)
        .expect(400);
      expect(res.body.message).toStrictEqual("User already exists");
    });
  });

  // Login test suite
  describe("User Login", () => {
    test("Should be able to login with valid credentials", async () => {
      const res = await request(app)
        .get("/auth/login")
        .send(validLoginUser)
        .expect(201);
      expect(res.body.message).toStrictEqual("Token Generated");
    });

    // Invalid user login should throw user not found error
    test("Should throw error if user does not exist", async () => {
      const res = await request(app)
        .get("/auth/login")
        .send(invalidLoginUser)
        .expect(400);
      expect(res.body.message).toStrictEqual("User not found");
    });

    // Unauthorized user
    test("Should throw error saying Unauthorized if wrong password", async () => {
      const res = await request(app)
        .get("/auth/login")
        .send(unauthorizedUser)
        .expect(401);
      expect(res.body.message).toStrictEqual("Invalid credentials");
    });
  });

  describe("Index.js Endpoints", () => {
    test("GET / endpoint", async () => {
      const res = await request(app).get("/").expect(200);
      expect(res.text).toBe("Burrito Shop");
    });
    test("GET /test Endpoint", async () => {
      const res = await request(app).get("/test").expect(200);
      expect(res.text).toBe("Server is up and running");
    });
  });
});

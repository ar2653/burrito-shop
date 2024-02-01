const newRegisteredUser = {
  first_name: "John",
  last_name: "Doe",
  email_address: "john@gmail.com",
  password: "password@123",
};

const existingUser = {
  first_name: "John",
  last_name: "Doe",
  email_address: "john@gmail.com",
  password: "password@123",
};

const validLoginUser = {
  email_address: "john@gmail.com",
  password: "password@123",
};

const invalidLoginUser = {
  email_address: "nonexistent@gmail.com",
  password: "invalidpassword",
};

const unauthorizedUser = {
  email_address: "john@gmail.com",
  password: "wrongpassword",
};

module.exports = {
  newRegisteredUser,
  existingUser,
  validLoginUser,
  invalidLoginUser,
  unauthorizedUser
}
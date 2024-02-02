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

const userPayload = {
  user_id: 1,
  email_address: "johndoe@gmail.com"
}

module.exports = {
  newRegisteredUser,
  existingUser,
  validLoginUser,
  invalidLoginUser,
  unauthorizedUser,
  userPayload
}
require("dotenv").config();
const axios = require('axios');

const axiosCall = async (url, method, data) => {
  try {
    const response = await axios({
      method,
      url: `http://localhost:${process.env.PORT || 4001}${url}`,
      data,
    });
    return response.data;
  } catch (error) {
    console.error('Error making HTTP request:', error.message);
    throw error;
  }
};

module.exports = axiosCall;

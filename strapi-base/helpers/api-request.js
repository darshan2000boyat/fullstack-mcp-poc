const axios = require('axios');

const apiRequest = async (method, url, data = null, headers = {}) => {
  try {

    const response = await axios({
      method,
      url,
      data,
      headers,
    });

    // Handle the response or return it to the caller
    return response.data;
  } catch (error) {
    // Handle errors
    //console.error('API Request Error:', error);
    throw error;
  }
};


module.exports = apiRequest;
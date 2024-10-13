const axios = require("axios");
const validUrl = require("valid-url");

async function validateURL(url) {
  if (!validUrl.isUri(url)) {
    throw new Error("Invalid URL");
  }

  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    throw new Error("URL is not reachable");
  }
}

module.exports = validateURL;

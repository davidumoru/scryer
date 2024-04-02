require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyse(reportData) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I have a website's scraped data, (content and internal linking structure). Can you analyze this data to identify patterns or trends based on different criterias like popular categories, common keywords, etc. Here is the report data: ${JSON.stringify(
    reportData
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function extract(reportData) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I have a website's scraped data, (content and internal linking structure). Can you help me extract specific data points like descriptions, prices, etc? Here is the report data: ${JSON.stringify(
    reportData
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function filter(reportData) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I have a website's scraped data, (content and internal linking structure). Can you filter this data based on different criterias like specific keywords, data ranges, etc. to get a more refined dataset? Here is the report data: ${JSON.stringify(
    reportData
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function summarize(reportData) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I have a website's scraped data, (content and internal linking structure). Can you summarize the key findings and identify any overarching themes or trends within the content? Here is the report data: ${JSON.stringify(
    reportData
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

module.exports = { analyse, extract, filter, summarize };

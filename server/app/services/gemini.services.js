require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function analyse() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "I have a website's content and internal linking structure. Can you analyze this data to identify patterns or trends based on the criteria I provide (e.g., popular categories, common keywords)?";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function extract() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "I have a website's HTML structure and content. Can you help me extract specific data points like descriptions, prices, or other details I specify?";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function filter() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "I have a website's scraped data. Can you filter this data based on the criteria I specify (e.g., specific keywords, data ranges) to get a more refined dataset?";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

async function summarize() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt =
    "I have a website's scraped data, including text and links. Can you summarize the key findings and identify any overarching themes or trends within the content?";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return { text };
}

module.exports = { analyse, extract, filter, summarize };

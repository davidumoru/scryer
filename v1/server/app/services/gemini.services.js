require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generate(webData, linkingStructure) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `I have a website's scraped data, (content and internal linking structure). Can you analyze this data to identify patterns or trends based on different criterias like popular categories, common keywords, etc. Here is the report data: ${JSON.stringify(
    webData,
    linkingStructure
  )}`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return {
    statusCode: 200,
    data: { text },
  };
}

module.exports = { generate };

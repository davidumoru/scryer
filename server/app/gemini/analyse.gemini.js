require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

async function run() {
  const model = genAI.getGenerativeModel({ model: "gemini-pro"});

  const prompt = "I have a website's content and internal linking structure. Can you analyze this data to identify patterns or trends based on the criteria I provide (e.g., popular categories, common keywords)?"

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
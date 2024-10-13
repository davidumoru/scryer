const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function sendToGeminiAI(scrapedData) {
  try {
    const bodyText = scrapedData.bodyText || "";
    const title = scrapedData.title || "";
    const headings = scrapedData.headings.join(", ") || "";

    const prompt = `
      Analyze the following webpage data. Focus on identifying key themes, sentiment, tone, and any important patterns in the text. Also, provide insights on the readability and the overall structure of the content.

      ---

      **Title:**
      ${title}

      **Headings:**
      ${headings}

      **Body Text:**
      ${bodyText}

      ---

      Please provide detailed insights on:
      1. The main topics or themes present in the content.
      2. The overall tone (e.g., informative, persuasive, neutral, etc.).
      3. The clarity and readability of the content.
      4. Any suggestions for improving the structure or flow of the text.
      5. Any other notable observations.
    `;

    const result = await model.generateContent(prompt);

    return result.response.text();
  } catch (error) {
    throw new Error(`Failed to send data to Gemini AI: ${error.message}`);
  }
}

module.exports = sendToGeminiAI;

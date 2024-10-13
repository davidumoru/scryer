const express = require("express");
const validateURL = require("../utils/validateUrl");
const crawlSite = require("../controllers/crawlerController");
const scrapeData = require("../controllers/scraperController");
const sendToGeminiAI = require("../utils/gemini");

const router = express.Router();

router.post("/crawl", async (req, res) => {
  const { url } = req.body;

  try {
    const isValid = await validateURL(url);
    if (!isValid) throw new Error("Invalid URL");

    const internalLinks = await crawlSite(url);
    const scrapedData = await scrapeData(url);

    // Send scraped data to Gemini AI
    const geminiResponse = await sendToGeminiAI(scrapedData);

    res.status(200).json({
      message: "Data sent to Gemini AI successfully",
      internalLinks,
      scrapedData,
      geminiResponse,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const geminiService = require("../services/gemini.services");
const crawlerService = require("../services/crawl.services");
const scraperService = require("../services/scrape.services");
const { printLinkStructure } = require("../utils/printLinks");

const generate = async (req, res) => {
  try {
    const url = req.body.url;
    const pages = await crawlerService.crawlPage(url, url, {});
    const linkingStructure = printLinkStructure(pages);

    const webData = await scraperService.scrapePage(url);
    const result = await geminiService.generate(webData.data, linkingStructure);

    res.status(data.statusCode).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { generate };

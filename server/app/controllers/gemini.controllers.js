const geminiService = require("../services/gemini.services");
const { crawlPage } = require("../services/crawl.services");
const { printReport } = require("../utils/printReport");

const analyse = async (req, res) => {
  try {
    const url = req.body.url;
    pages = await crawlPage(url, url, {});
    const reportData = printReport(pages);

    const jsonData = await geminiService.analyse(reportData);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const extract = async (req, res) => {
  try {
    const url = req.body.url;
    pages = await crawlPage(url, url, {});
    const reportData = printReport(pages);

    const jsonData = await geminiService.extract(reportData);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const filter = async (req, res) => {
  try {
    const url = req.body.url;
    pages = await crawlPage(url, url, {});
    const reportData = printReport(pages);

    const jsonData = await geminiService.filter(reportData);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

const summarize = async (req, res) => {
  try {
    const url = req.body.url;
    pages = await crawlPage(url, url, {});
    const reportData = printReport(pages);

    const jsonData = await geminiService.summarize(reportData);
    res.json(jsonData);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating text");
  }
};

module.exports = { analyse, extract, filter, summarize };

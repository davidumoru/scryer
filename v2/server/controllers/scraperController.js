const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeData(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const scrapedData = {
      title: $("title").text(),
      headings: $("h1, h2, h3")
        .map((i, el) => $(el).text())
        .get(),
      bodyText: $("body").text().trim(),
    };

    return scrapedData;
  } catch (error) {
    throw new Error(`Failed to scrape ${url}: ${error.message}`);
  }
}

module.exports = scrapeData;

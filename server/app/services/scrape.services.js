const puppeteer = require("puppeteer");
const { normalizeURL } = require("../utils/normalizeURL");
const response = require("../utils/response");

async function scrapePage(url) {
  const normalizedURL = normalizeURL(url);
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(normalizedURL);

    const title = await page.evaluate(() => document.title);
    const text = await page.evaluate(() => document.body.innerText);
    const webData = {
      title: title,
      text: text,
    };

    await browser.close();
    return response.buildSuccessResponse("Webpage Scraped Successfully", 201, {
      webData,
    });
  } catch (error) {
    console.error(error);
    return response.buildFailureResponse("Internal Server Error", 500);
  }
}

module.exports = { scrapePage };

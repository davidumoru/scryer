const axios = require("axios");
const cheerio = require("cheerio");

async function crawlSite(url) {
  const visitedLinks = new Set();
  const toVisit = [url];
  const internalLinkHits = {};

  while (toVisit.length > 0) {
    const currentUrl = toVisit.pop();
    if (visitedLinks.has(currentUrl)) continue;
    visitedLinks.add(currentUrl);

    try {
      const { data } = await axios.get(currentUrl);
      const $ = cheerio.load(data);

      // Find all internal links and process them
      $('a[href^="/"]').each((_, element) => {
        const link = new URL($(element).attr("href"), url).href;
        if (!visitedLinks.has(link)) {
          toVisit.push(link);
        }

        // Count hits for each link
        if (internalLinkHits[link]) {
          internalLinkHits[link] += 1;
        } else {
          internalLinkHits[link] = 1;
        }
      });
    } catch (err) {
      console.error(`Failed to crawl ${currentUrl}: ${err.message}`);
    }
  }

  // Convert internalLinkHits object to an array of {link, hits}
  const uniqueLinks = Object.keys(internalLinkHits).map((link) => ({
    link,
    hits: internalLinkHits[link],
  }));

  return uniqueLinks;
}

module.exports = crawlSite;

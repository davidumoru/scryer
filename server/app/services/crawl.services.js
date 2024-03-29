const { normalizeURL } = require("../utils/normalizeURL");
const { getURLsFromHTML } = require("../utils/getURLsFromHTML");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);
  if (currentURLObj.hostname !== baseURLObj.hostname) {
    // console.log(`skipping external link: ${currentURL}`);
    return pages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (pages[normalizedCurrentURL] > 0) {
    pages[normalizedCurrentURL]++;
    // console.log(`skipping already visited page: ${currentURL}`);
    return pages;
  }

  pages[normalizedCurrentURL] = 1;

  console.log(`...actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status >= 400) {
      console.log(
        `error in fetch with status code ${resp.status} on page ${currentURL}`
      );
      return pages;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      // console.log(`skipping non-html content-type: ${contentType}`);
      return pages;
    }

    const htmlBody = await resp.text();
    const urls = getURLsFromHTML(htmlBody, baseURL);

    for (const url of urls) {
      pages = await crawlPage(baseURL, url, pages);
    }
    return pages;
  } catch (err) {
    console.log(`error in fetch--> ${err} on page ${currentURL}`);
  }
}

module.exports = { crawlPage };

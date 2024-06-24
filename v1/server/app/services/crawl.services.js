const { JSDOM } = require("jsdom");
const { normalizeURL } = require("../utils/normalizeURL");

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

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // relative url
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with relative url: ${err.message}`);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url: ${err.message}`);
      }
    }
  }
  return urls;
}

module.exports = { crawlPage };

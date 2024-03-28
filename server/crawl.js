const { JSDOM } = require("jsdom");

async function crawlPage(currentURL) {
  console.log(`...actively crawling: ${currentURL}`);

  try {
    const resp = await fetch(currentURL);

    if (resp.status >= 400) {
      console.log(
        `error in fetch with status code ${resp.status} on page ${currentURL}`
      );
      return;
    }

    const contentType = resp.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      console.log(`skipping non-html content-type: ${contentType}`);
      return;
    }

    console.log(await resp.text());
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
        urls.push(normalizeURL(urlObj.href));
      } catch (err) {
        console.log(`error with relative url: ${linkElement.href}`);
      }
    } else {
      // absolute url
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(normalizeURL(urlObj.href));
      } catch (err) {
        console.log(`error with absolute url: ${linkElement.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(url) {
  return url
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};

const { JSDOM } = require("jsdom");

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
};

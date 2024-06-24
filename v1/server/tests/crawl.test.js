const { normalizeURL } = require("../app/utils/normalizeURL");
const { getURLsFromHTML } = require("../app/utils/getURLsFromHTML");
const { test, expect } = require("@jest/globals");

test("normalizeURL- strip protocol", () => {
  const input = "https://example.com";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeURL- strip trailing slash", () => {
  const input = "https://example.com/";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeURL- strip capitals", () => {
  const input = "htpps://eXaMplE.cOm";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML- absolute urls ", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <p>Hello, World!</p>
      <a href="https://example.com">Example Link</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://example.com/"];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML- relative urls", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <p>Hello, World!</p>
      <a href="/path">Example Link</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://example.com/path"];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML- multiple urls", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <p>Hello, World!</p>
      <a href="https://example.com/path1">Example Link</a>
      <a href="/path2">Example Link</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://example.com/path1", "https://example.com/path2"];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML- invalid urls", () => {
  const inputHTMLBody = `
  <html>
    <body>
      <p>Hello, World!</p>
      <a href="invalid">Example Link</a>
      <a href="https://example.com/valid">Valid Link</a>
    </body>
  </html>
  `;
  const inputBaseURL = "https://example.com";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://example.com/valid"];

  expect(actual).toEqual(expected);
});

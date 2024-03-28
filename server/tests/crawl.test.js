const { normalizeURL } = require("../crawl");
const { test, expect } = require("@jest/globals");

test("normalizeURL- strip protocol", () => {
  const input = "https://example.com";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeURL- strip trailing slash", () => {
  const input = "example.com/";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeURL- strip capitals", () => {
  const input = "eXaMplE.cOm";
  const actual = normalizeURL(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

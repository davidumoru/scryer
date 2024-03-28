const { normalizeUrl } = require("../crawl");
const { test, expect } = require("@jest/globals");

test("normalizeUrl- strip protocol", () => {
  const input = "https://example.com";
  const actual = normalizeUrl(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeUrl- strip trailing slash", () => {
  const input = "example.com/";
  const actual = normalizeUrl(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

test("normalizeUrl- strip capitals", () => {
  const input = "eXaMplE.cOm";
  const actual = normalizeUrl(input);
  const expected = "example.com";

  expect(actual).toEqual(expected);
});

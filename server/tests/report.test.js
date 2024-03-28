const { sortPages } = require("../report");
const { test, expect } = require("@jest/globals");

test("sortPages- 2 pages", () => {
  const input = {
    "https://example.com": 1,
    "https://example.com/about": 2,
    "https://example.com/contact": 4,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://example.com/contact", 4],
    ["https://example.com/about", 2],
    ["https://example.com", 1],
  ];

  expect(actual).toEqual(expected);
});

test("sortPages- 6 pages", () => {
  const input = {
    "https://example.com": 1,
    "https://example.com/about": 2,
    "https://example.com/contact": 4,
    "https://example.com/services": 1,
    "https://example.com/products": 2,
    "https://example.com/clients": 4,
  };
  const actual = sortPages(input);
  const expected = [
    ["https://example.com/contact", 4],
    ["https://example.com/clients", 4],
    ["https://example.com/about", 2],
    ["https://example.com/products", 2],
    ["https://example.com", 1],
    ["https://example.com/services", 1],
  ];

  expect(actual).toEqual(expected);
});

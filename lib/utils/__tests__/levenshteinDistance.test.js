"use strict";

const levenshteinDistance = require("../levenshteinDistance");

it("return -1 if max distance exited", () => {
  expect(levenshteinDistance("aaaaa aaaaa", "aaaaa", 5)).toBe(-1);
  expect(levenshteinDistance("a", "a", 0)).toBe(0);
  expect(levenshteinDistance("a", "aa", 0)).toBe(-1);
});

it("same strings return 0", () => {
  expect(levenshteinDistance("", "")).toBe(0);
  expect(levenshteinDistance("a", "a")).toBe(0);
  expect(levenshteinDistance("aaaa", "aaaa")).toBe(0);
  expect(levenshteinDistance("aa aa", "aa aa")).toBe(0);
});

it("common test cases", () => {
  expect(levenshteinDistance("funcsion", "function")).toBe(1);
  expect(levenshteinDistance("funtion", "function")).toBe(1);
  expect(levenshteinDistance("function-a", "a-function")).toBe(4);
  expect(levenshteinDistance("allow", "allows")).toBe(1);
  expect(levenshteinDistance("block-no-empty", "block-emty-no")).toBe(7);
  expect(levenshteinDistance("comments", "coment")).toBe(2);
});

it("max distance works properly", () => {
  expect(levenshteinDistance("blabla", "albalb", 4)).toBe(4);
  expect(levenshteinDistance("comments", "comment", 1)).toBe(1);
  expect(levenshteinDistance("comments", "coment", 1)).toBe(-1);
  expect(
    levenshteinDistance("duplicate-no-sorce", "no-duplicate-source", 3)
  ).toBe(-1);
});

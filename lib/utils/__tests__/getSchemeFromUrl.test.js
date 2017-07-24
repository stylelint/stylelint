"use strict";

const getSchemeFromUrl = require("../getSchemeFromUrl");

it("getSchemeFromUrl", () => {
  expect(getSchemeFromUrl("")).toBe(null);
  expect(getSchemeFromUrl(":")).toBe(null);
  expect(getSchemeFromUrl("://")).toBe(null);
  expect(getSchemeFromUrl("./file.jpg")).toBe(null);
  expect(getSchemeFromUrl("/path/to/file.jpg")).toBe(null);
  expect(getSchemeFromUrl("//www.example.com/file.jpg")).toBe(null);
  expect(getSchemeFromUrl("http://www.example.com/file.jpg")).toBe("http");
  expect(getSchemeFromUrl("HTTPS://www.example.com/file.jpg")).toBe("https");
  expect(
    getSchemeFromUrl(
      "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
    )
  ).toBe("data");
});

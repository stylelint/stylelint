"use strict";

const isCustomPropertySet = require("../isCustomPropertySet");
const postcss = require("postcss");

describe("isCustomPropertySet", () => {
  it("accepts custom property set", () => {
    return customPropertySet("--foo: {};", customPropertySet => {
      expect(isCustomPropertySet(customPropertySet)).toBeTruthy();
    });
  });

  it("rejects custom property", () => {
    return customPropertySet("--foo: red;", customPropertySet => {
      expect(isCustomPropertySet(customPropertySet)).toBeFalsy();
    });
  });
});

function customPropertySet(css, cb) {
  return postcss()
    .process(css)
    .then(result => {
      result.root.walk(cb);
    });
}

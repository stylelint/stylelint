"use strict";

const isNestedProperty = require("../isNestedProperty");
const postcss = require("postcss");

describe("isNestedProperty", () => {
  it("accepts nested property", () => {
    return nestedProperty("foo: {};", nestedProperty => {
      expect(isNestedProperty(nestedProperty)).toBeTruthy();
    });
  });

  it("rejects nested property", () => {
    return nestedProperty("foo: red;", nestedProperty => {
      expect(isNestedProperty(nestedProperty)).toBeFalsy();
    });
  });
});

function nestedProperty(css, cb) {
  return postcss()
    .process(css, { from: undefined })
    .then(result => {
      result.root.walk(cb);
    });
}

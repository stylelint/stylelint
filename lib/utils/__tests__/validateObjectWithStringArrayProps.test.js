"use strict";

const validateObjectWithStringArrayProps = require("../validateObjectWithStringArrayProps");

it("validateObjectWithStringArrayProps", () => {
  expect(validateObjectWithStringArrayProps({ prop: ["val"] })).toBeTruthy();
  expect(
    validateObjectWithStringArrayProps({ prop: ["val1", "val2", "val3"] })
  ).toBeTruthy();
  expect(
    validateObjectWithStringArrayProps({
      prop1: ["val1"],
      prop2: ["val21", "val22"],
      prop3: ["val31", "val32", "val33"]
    })
  ).toBeTruthy();

  expect(validateObjectWithStringArrayProps({ prop: 1 })).toBeFalsy();
  expect(validateObjectWithStringArrayProps({ prop: "string" })).toBeFalsy();
  expect(validateObjectWithStringArrayProps({ prop: null })).toBeFalsy();
  expect(validateObjectWithStringArrayProps({ prop: {} })).toBeFalsy();

  expect(validateObjectWithStringArrayProps({ prop: ["1", 1] })).toBeFalsy();
  expect(
    validateObjectWithStringArrayProps({ prop: ["null", null] })
  ).toBeFalsy();
  expect(
    validateObjectWithStringArrayProps({ prop: ["object", {}] })
  ).toBeFalsy();

  expect(
    validateObjectWithStringArrayProps({ prop1: ["1"], prop2: ["1", 1] })
  ).toBeFalsy();
  expect(
    validateObjectWithStringArrayProps({ prop1: ["1"], prop2: ["null", null] })
  ).toBeFalsy();
  expect(
    validateObjectWithStringArrayProps({ prop1: ["1"], prop2: ["object", {}] })
  ).toBeFalsy();
});

it("allows regular expressions if an optional second variable is set to true", () => {
  expect(validateObjectWithStringArrayProps({ prop: [/val/, "val"] }, true))
    .toBeTruthy();

  expect(validateObjectWithStringArrayProps({ prop: [3.14] }, true))
    .toBeFalsy();
});

"use strict"

const isStandardSyntaxValue = require("../isStandardSyntaxValue")

describe("isStandardSyntaxValue", () => {
  it("keyword", () => {
    expect(isStandardSyntaxValue("initial")).toBeTruthy()
  })
  it("svg keyword", () => {
    expect(isStandardSyntaxValue("currentColor")).toBeTruthy()
  })
  it("dimension", () => {
    expect(isStandardSyntaxValue("10px")).toBeTruthy()
  })
  it("angle", () => {
    expect(isStandardSyntaxValue("45deg")).toBeTruthy()
  })
  it("scss var", () => {
    expect(isStandardSyntaxValue("$sass-variable")).toBeFalsy()
  })
  it("less var", () => {
    expect(isStandardSyntaxValue("@less-variable")).toBeFalsy()
  })
  it("scss interpolation", () => {
    expect(isStandardSyntaxValue("#{$var}")).toBeFalsy()
  })
  it("less interpolation", () => {
    expect(isStandardSyntaxValue("@{var}")).toBeFalsy()
  })
})

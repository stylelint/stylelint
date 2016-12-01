"use strict"

const isStandardSyntaxSelector = require("../isStandardSyntaxSelector")

describe("isStandardSyntaxSelector", () => {
  it("type", () => {
    expect(isStandardSyntaxSelector("a")).toBeTruthy()
  })
  it("class", () => {
    expect(isStandardSyntaxSelector(".a")).toBeTruthy()
  })
  it("attribute", () => {
    expect(isStandardSyntaxSelector("[a=a]")).toBeTruthy()
  })
  it("universal", () => {
    expect(isStandardSyntaxSelector("*")).toBeTruthy()
  })
  it("pseudo-class", () => {
    expect(isStandardSyntaxSelector("a:last-child")).toBeTruthy()
  })
  it("pseudo-class with function", () => {
    expect(isStandardSyntaxSelector("a:not(.b)")).toBeTruthy()
  })
  it("pseudo-element", () => {
    expect(isStandardSyntaxSelector("a::after")).toBeTruthy()
  })
  it("compound", () => {
    expect(isStandardSyntaxSelector("a.b")).toBeTruthy()
  })
  it("complex", () => {
    expect(isStandardSyntaxSelector("a > b")).toBeTruthy()
  })
  it("list", () => {
    expect(isStandardSyntaxSelector("a, b")).toBeTruthy()
  })
  it("SCSS interpolation (id)", () => {
    expect(isStandardSyntaxSelector("#{50% - $n}")).toBeFalsy()
  })
  it("SCSS interpolation (class)", () => {
    expect(isStandardSyntaxSelector(".n-#{$n}")).toBeFalsy()
  })
  it("SCSS interpolation (pseudo)", () => {
    expect(isStandardSyntaxSelector(":n-#{$n}")).toBeFalsy()
  })
  it("Less interpolation", () => {
    expect(isStandardSyntaxSelector(".n-@{n}")).toBeFalsy()
  })
  it("SCSS placeholder", () => {
    expect(isStandardSyntaxSelector("%foo")).toBeFalsy()
  })
})

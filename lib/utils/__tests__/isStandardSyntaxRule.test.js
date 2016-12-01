"use strict"

const isStandardSyntaxRule = require("../isStandardSyntaxRule")
const less = require("postcss-less")
const postcss = require("postcss")

describe("isStandardSyntaxRule", () => {
  it("type", () => {
    return rules("a {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("pseudo-class", () => {
    return rules("a:last-child {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("pseudo-class not", () => {
    return rules("a:not(.a) {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("pseudo-element", () => {
    return rules("a::after {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("custom-selector", () => {
    return rules(":--custom-selector {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("compound custom-selectors", () => {
    return rules(":--custom-selector:--custom-selector {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
  it("custom-property-set", () => {
    return rules("--custom-property-set: {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("called Less class parametric mixin", () => {
    lessRules(".mixin-name(@var);", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("non-ouputting parametric Less class mixin definition", () => {
    lessRules(".mixin-name() {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("non-ouputting Less class mixin definition", () => {
    lessRules(".mixin-name(@a, @b) {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("non-ouputting parametric Less class mixin definition ending in number", () => {
    lessRules(".mixin-name3(@a, @b) {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("non-ouputting Less id mixin definition", () => {
    lessRules("#mixin-name() {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("called Less id mixin", () => {
    lessRules("#mixin-name;", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("called namespaced Less mixin (child)", () => {
    lessRules("#namespace > .mixin-name;", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("called namespaced Less mixin (descendant)", () => {
    lessRules("#namespace .mixin-name;", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("called namespaced Less mixin (compound)", () => {
    lessRules("#namespace.mixin-name;", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("less mixin", () => {
    lessRules(".box-shadow(@style, @c) when (iscolor(@c)) {}", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("less extend", () => {
    lessRules("&:extend(.inline);", rule => {
      expect(isStandardSyntaxRule(rule)).toBeFalsy()
    })
  })
  it("less detached rulesets", () => {
    lessRules("@foo: {};", rule => {
      expect(isStandardSyntaxRule(rule)).toBeTruthy()
    })
  })
})

function rules(css, cb) {
  return postcss().process(css)
  .then(result => {
    return result.root.walkRules(cb)
  })
}

function lessRules(css, cb) {
  return postcss().process(css, { syntax: less })
  .then(result => {
    return result.root.walkRules(cb)
  })
}

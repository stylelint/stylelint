"use strict"

const isStandardSyntaxTypeSelector = require("../isStandardSyntaxTypeSelector")
const postcss = require("postcss")
const selectorParser = require("postcss-selector-parser")

describe("isStandardSyntaxTypeSelector", () => {
  it("tag", () => {
    return rules("a {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeTruthy()
    })
  })
  it("nth-child pseudo selector", () => {
    return rules(".foo:nth-child(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("nth-last-child pseudo selector", () => {
    return rules(".foo:nth-last-child(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("nth-of-type pseudo selector", () => {
    return rules(".foo:nth-of-type(n) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("lang pseudo selector", () => {
    return rules(":lang(en) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("dir pseudo selector", () => {
    return rules(":dir(ltr) {}", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("nesting selector", () => {
    return rules(".foo { &-bar {} }", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
  it("nesting selector", () => {
    return rules(".foo { &__bar {} }", func => {
      expect(isStandardSyntaxTypeSelector(func)).toBeFalsy()
    })
  })
})

function rules(css, cb) {
  return postcss().process(css).then(result => {
    return result.root.walkRules(rule => {
      selectorParser(selectorAST => {
        selectorAST.walkTags(cb)
      }).process(rule.selector)
    })
  })
}

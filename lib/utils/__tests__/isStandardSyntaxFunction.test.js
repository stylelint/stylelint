"use strict"

const isStandardSyntaxFunction = require("../isStandardSyntaxFunction")
const postcss = require("postcss")
const valueParser = require("postcss-value-parser")

describe("isStandardSyntaxFunction", () => {
  it("calc", () => {
    return rules("a { prop: calc(a + b) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeTruthy()
    })
  })

  it("url", () => {
    return rules("a { prop: url('x.css') }", func => {
      expect(isStandardSyntaxFunction(func)).toBeTruthy()
    })
  })

  it("scss list", () => {
    return rules("a { $list: (list) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeFalsy()
    })
  })

  it("scss map", () => {
    return rules("a { $map: (key: value) }", func => {
      expect(isStandardSyntaxFunction(func)).toBeFalsy()
    })
  })
})

function rules(css, cb) {
  return postcss().process(css)
  .then(result => {
    return result.root.walkDecls(decl => {
      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") { return }
        cb(valueNode)
      })
    })
  })
}

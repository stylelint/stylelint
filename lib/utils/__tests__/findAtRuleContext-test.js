"use strict"

const findAtRuleContext = require("../findAtRuleContext")
const postcss = require("postcss")
const test = require("tape")

test("findAtRuleContext", t => {
  const css = `
    a {}
    @media print {
      b {}
    }
    @media (min-width: 900px) {
      c {}
    }
    d {}
  `

  t.plan(4)
  postcss().process(css).then(result => {
    result.root.walkRules(rule => {
      switch (rule.selector) {
        case "a":
          t.equal(findAtRuleContext(rule), null)
          break
        case "b":
          t.equal(findAtRuleContext(rule).params, "print")
          break
        case "c":
          t.equal(findAtRuleContext(rule).params, "(min-width: 900px)")
          break
        case "d":
          t.equal(findAtRuleContext(rule), null)
          break
        default:
      }
    })
  })
})

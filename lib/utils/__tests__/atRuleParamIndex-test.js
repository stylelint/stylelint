"use strict"

const atRuleParamIndex = require("../atRuleParamIndex")
const postcss = require("postcss")
const test = require("tape")

test("atRuleParamIndex", t => {
  t.plan(4)

  atRules("@media (color) {}", atRule => {
    t.equal(atRuleParamIndex(atRule), 7)
  })
  atRules("@media  (color) {}", atRule => {
    t.equal(atRuleParamIndex(atRule), 8)
  })
  atRules("@import\n'x.css');", atRule => {
    t.equal(atRuleParamIndex(atRule), 8)
  })
  atRules("@document url-prefix(http://www.w3.org/Style/)", atRule => {
    t.equal(atRuleParamIndex(atRule), 10)
  })
})

function atRules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkAtRules(cb)
  })
}

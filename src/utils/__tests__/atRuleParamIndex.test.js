import atRuleParamIndex from "../atRuleParamIndex"
import postcss from "postcss"

it("atRuleParamIndex", () => {
  t.plan(4)

  atRules("@media (color) {}", atRule => {
    expect(atRuleParamIndex(atRule)).toBe(7)
  })
  atRules("@media  (color) {}", atRule => {
    expect(atRuleParamIndex(atRule)).toBe(8)
  })
  atRules("@import\n'x.css');", atRule => {
    expect(atRuleParamIndex(atRule)).toBe(8)
  })
  atRules("@document url-prefix(http://www.w3.org/Style/)", atRule => {
    expect(atRuleParamIndex(atRule)).toBe(10)
  })
})

function atRules(css, cb) {
  postcss().process(css).then(result => {
    result.root.walkAtRules(cb)
  })
}

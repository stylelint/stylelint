/* @flow */
import atRuleParamIndex from "../atRuleParamIndex"
import postcss from "postcss"

describe("atRuleParamIndex", () => {
  it("has a single space before the param", () => {
    return atRules("@media (color) {}", atRule => {
      expect(atRuleParamIndex(atRule)).toBe(7)
    })
  })

  it("has multiple spaces before the param", () => {
    return atRules("@media  (color) {}", atRule => {
      expect(atRuleParamIndex(atRule)).toBe(8)
    })
  })

  it("has a newline before the param", () => {
    return atRules("@import\n'x.css');", atRule => {
      expect(atRuleParamIndex(atRule)).toBe(8)
    })
  })

  it("has a function param", () => {
    return atRules("@document url-prefix(http://www.w3.org/Style/)", atRule => {
      expect(atRuleParamIndex(atRule)).toBe(10)
    })
  })
})

function atRules(
  css: string,
  cb: Function
): Promise<postcss$result> {
  return postcss().process(css)
  .then(result => {
    return result.root.walkAtRules(cb)
  })
}

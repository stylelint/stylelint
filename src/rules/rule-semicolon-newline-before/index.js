import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "rule-semicolon-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ";"`,
  rejectedBefore: () => `Unexpected space before ";"`,
  expectedBeforeMultiLine: () => `Expected newline before ";" within multi-line rule`,
  rejectedBeforeMultiLine: () => `Unexpected space before ";" within multi-line rule`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("\n", expectation, messages)
  return function (css, result) {
    css.eachDecl(function (decl) {
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const declString = decl.toString()
      check.before(declString, declString.length, m => {
        return report({
          message: m,
          node: decl,
          result,
          ruleName,
        })
      }, parentRule.toString().slice("{"))
    })
  }
}

import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ";"`,
  expectedBeforeMultiLine: () => `Expected newline before ";" within multi-line rule`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before ";" within multi-line rule`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("\n", expectation, messages)
  return function (css, result) {
    css.eachDecl(function (decl) {
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const declString = decl.toString()
      const parentRuleString = parentRule.toString()

      check.before(declString, declString.length, m => {
        return report({
          message: m,
          node: decl,
          result,
          ruleName,
        })
      }, parentRuleString.slice(parentRuleString.indexOf("{")))
    })
  }
}

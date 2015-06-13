import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "rule-semicolon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ";"`,
  rejectedBefore: () => `Unexpected space before ";"`,
  expectedBeforeSingleLine: () => `Expected single space before ";" within single-line rule`,
  rejectedBeforeSingleLine: () => `Unexpected space before ";" within single-line rule`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker(" ", expectation, messages)
  return function (css, result) {
    css.eachDecl(function (decl) {
      // Ignore last declaration if there's no trailing semicolon
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

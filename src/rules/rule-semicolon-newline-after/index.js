import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "rule-semicolon-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ";"`,
  rejectedAfter: () => `Unexpected newline after ";"`,
  expectedAfterMultiLine: () => `Expected newline after ";" within multi-line rule`,
  rejectedAfterMultiLine: () => `Unexpected newline after ";" within multi-line rule`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("\n", expectation, messages)
  return function (css, result) {
    css.eachDecl(function (decl) {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const nextDecl = decl.next()
      if (!nextDecl) { return }
      check.afterOneOnly(nextDecl.toString(), -1, m => {
        return result.warn(m, { node: decl })
      }, parentRule.toString().slice("{"))
    })
  }
}

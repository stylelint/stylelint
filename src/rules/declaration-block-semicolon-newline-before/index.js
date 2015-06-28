import {
  cssStatementBlockString,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ";"`,
  expectedBeforeMultiLine: () => `Expected newline before ";" in a multi-line rule`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before ";" in a multi-line rule`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("\n", expectation, messages)
  return function (root, result) {
    root.eachDecl(function (decl) {
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const declString = decl.toString()

      check.before({
        source: declString,
        index: declString.length,
        lineCheckStr: cssStatementBlockString(parentRule),
        err: m => {
          return report({
            message: m,
            node: decl,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

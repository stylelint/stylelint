import {
  blockString,
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ";"`,
  rejectedBefore: () => `Unexpected whitespace before ";"`,
  expectedBeforeSingleLine: () => `Expected single space before ";" in a single-line rule`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before ";" in a single-line rule`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker(" ", expectation, messages)
  return (root, result) => {
    root.eachDecl(decl => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const declString = decl.toString()

      check.before({
        source: declString,
        index: declString.length,
        lineCheckStr: blockString(parentRule),
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

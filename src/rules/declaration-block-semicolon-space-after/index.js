import {
  cssStatementBlockString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after ";"`,
  rejectedAfter: () => `Unexpected whitespace after ";"`,
  expectedAfterSingleLine: () => `Expected single space after ";" in a single-line rule`,
  rejectedAfterSingleLine: () => `Unexpected whitespace after ";" in a single-line rule`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const check = whitespaceChecker("space", expectation, messages)
  return function (root, result) {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
      ],
    })

    root.eachDecl(function (decl) {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const nextDecl = decl.next()
      if (!nextDecl) { return }

      check.after({
        source: nextDecl.toString(),
        index: -1,
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

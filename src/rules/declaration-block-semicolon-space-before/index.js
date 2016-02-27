import {
  cssStatementBlockString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-block-semicolon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \";\"",
  rejectedBefore: () => "Unexpected whitespace before \";\"",
  expectedBeforeSingleLine: () => "Expected single space before \";\" in a single-line rule",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \";\" in a single-line rule",
})

export default function (expectation) {

  const checker = whitespaceChecker("space", expectation, messages)

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.raw("semicolon") && parentRule.last === decl) { return }

      const declString = decl.toString()

      checker.before({
        source: declString,
        index: declString.length,
        lineCheckStr: cssStatementBlockString(parentRule),
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.toString().length - 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

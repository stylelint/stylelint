import {
  blockString,
  rawNodeString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

export const ruleName = "declaration-block-semicolon-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected single space after \";\"",
  rejectedAfter: () => "Unexpected whitespace after \";\"",
  expectedAfterSingleLine: () => "Expected single space after \";\" in a single-line declaration block",
  rejectedAfterSingleLine: () => "Unexpected whitespace after \";\" in a single-line declaration block",
})

export default function (expectation) {

  const checker = whitespaceChecker("space", expectation, messages)

  return function (root, result) {
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

    root.walkDecls(function (decl) {
      // Ignore last declaration if there's no trailing semicolon
      const parentRule = decl.parent
      if (!parentRule.raw("semicolon") && parentRule.last === decl) { return }

      const nextDecl = decl.next()
      if (!nextDecl) { return }

      checker.after({
        source: rawNodeString(nextDecl),
        index: -1,
        lineCheckStr: blockString(parentRule),
        err: m => {
          report({
            message: m,
            node: decl,
            index: decl.toString().length + 1,
            result,
            ruleName,
          })
        },
      })
    })
  }
}

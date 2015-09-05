import {
  report,
  ruleMessages,
  cssStatementHasEmptyBlock,
  validateOptions
} from "../../utils"

export const ruleName = "rule-trailing-semicolon"

export const messages = ruleMessages(ruleName, {
  expected: `Expected a trailing semicolon`,
  rejected: `Unexpected trailing semicolon`,
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkRules(rule => {
      // Return early if an empty rule
      if (cssStatementHasEmptyBlock(rule)) { return }

      if (!rule.last || rule.last.type !== "decl") { return }

      let errorIndex
      let message
      if (expectation === "always") {
        if (rule.raws.semicolon) { return }
        errorIndex = rule.toString().length - rule.raws.after.length - 1
        message = messages.expected
      }
      if (expectation === "never") {
        if (!rule.raws.semicolon) { return }
        errorIndex = rule.toString().length - rule.raws.after.length - 2
        message = messages.rejected
      }

      report({
        message,
        node: rule,
        index: errorIndex,
        result,
        ruleName,
      })
    })
  }
}

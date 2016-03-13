import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "string-quotes"

export const messages = ruleMessages(ruleName, {
  expected: q => `Expected ${q} quotes`,
})

export default function (expectation) {

  const erroneousQuote = (expectation === "single") ? "\"" : "'"

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "single",
        "double",
      ],
    })
    if (!validOptions) { return }

    const cssString = root.toString()
    styleSearch({ source: cssString, target: erroneousQuote }, match => {
      report({
        message: messages.expected(expectation),
        node: root,
        index: match.startIndex,
        result,
        ruleName,
      })
    })
  }
}

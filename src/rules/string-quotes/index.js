import {
  lineCount,
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "string-quotes"

export const messages = ruleMessages(ruleName, {
  expected: (q, l) => `Expected ${q} quotes around string on line ${l}`,
})

/**
 * @param {"single"|"double"} expectation
 */
export default function (expectation) {

  const erroneousQuote = (expectation === "single") ? "\"" : "'"

  return (root, result) => {
    const cssString = root.source.input.css
    styleSearch({ source: cssString, target: erroneousQuote }, match => {
      const line = lineCount(cssString.slice(0, match.startIndex))
      report({
        message: messages.expected(expectation, line),
        node: root,
        line: line,
        result,
        ruleName,
      })
    })
  }
}

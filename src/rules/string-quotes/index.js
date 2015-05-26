import {
  ruleMessages,
  valueIndexOf,
  lineCount
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

  return function (root, result) {
    const cssString = root.source.input.css
    valueIndexOf({ value: cssString, char: erroneousQuote }, index => {
      result.warn(
        messages.expected(expectation, lineCount(cssString.slice(0, index))),
        { node: root }
      )
    })
  }
}

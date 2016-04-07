import valueParser from "postcss-value-parser"
import {
  cssDeclarationIsMap,
  declarationValueIndexOffset,
  isSingleLineString,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-parentheses-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected single space after \"(\"",
  rejectedOpening: "Unexpected whitespace after \"(\"",
  expectedClosing: "Expected single space before \")\"",
  rejectedClosing: "Unexpected whitespace before \")\"",
  expectedOpeningSingleLine: "Expected single space after \"(\" in a single-line function",
  rejectedOpeningSingleLine: "Unexpected whitespace after \"(\" in a single-line function",
  expectedClosingSingleLine: "Expected single space before \")\" in a single-line function",
  rejectedClosingSingleLine: "Unexpected whitespace before \")\" in a single-line function",
})

export default function (expectation) {
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
      if (cssDeclarationIsMap(decl)) { return }

      if (decl.value.indexOf("(") === -1) { return }

      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") { return }

        // Function nodes without names are things in parentheses like Sass lists
        if (!valueNode.value) { return }

        const functionString = valueParser.stringify(valueNode)
        const isSingleLine = isSingleLineString(functionString)

        // Check opening ...

        const openingIndex = valueNode.sourceIndex + valueNode.value.length + 1

        if (expectation === "always" && valueNode.before !== " ") {
          complain(messages.expectedOpening, openingIndex)
        }

        if (expectation === "never" && valueNode.before !== "") {
          complain(messages.rejectedOpening, openingIndex)
        }

        if (isSingleLine && expectation === "always-single-line" && valueNode.before !== " ") {
          complain(messages.expectedOpeningSingleLine, openingIndex)
        }

        if (isSingleLine && expectation === "never-single-line" && valueNode.before !== "") {
          complain(messages.rejectedOpeningSingleLine, openingIndex)
        }

        // Check closing ...

        const closingIndex = valueNode.sourceIndex + functionString.length - 2

        if (expectation === "always" && valueNode.after !== " ") {
          complain(messages.expectedClosing, closingIndex)
        }

        if (expectation === "never" && valueNode.after !== "") {
          complain(messages.rejectedClosing, closingIndex)
        }

        if (isSingleLine && expectation === "always-single-line" && valueNode.after !== " ") {
          complain(messages.expectedClosingSingleLine, closingIndex)
        }

        if (isSingleLine && expectation === "never-single-line" && valueNode.after !== "") {
          complain(messages.rejectedClosingSingleLine, closingIndex)
        }
      })

      function complain(message, offset) {
        report({
          ruleName,
          result,
          message,
          node: decl,
          index: declarationValueIndexOffset(decl) + offset,
        })
      }
    })
  }
}

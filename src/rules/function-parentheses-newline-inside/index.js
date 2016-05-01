import valueParser from "postcss-value-parser"
import {
  declarationValueIndex,
  isSingleLineString,
  isStandardFunction,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "function-parentheses-newline-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: "Expected newline after \"(\"",
  expectedClosing: "Expected newline before \")\"",
  expectedOpeningMultiLine: "Expected newline after \"(\" in a multi-line function",
  rejectedOpeningMultiLine: "Unexpected whitespace after \"(\" in a multi-line function",
  expectedClosingMultiLine: "Expected newline before \")\" in a multi-line function",
  rejectedClosingMultiLine: "Unexpected whitespace before \")\" in a multi-line function",
})

export default function (expectation) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (decl.value.indexOf("(") === -1) { return }

      valueParser(decl.value).walk(valueNode => {
        if (valueNode.type !== "function") { return }

        if (!isStandardFunction(valueNode)) { return }

        const functionString = valueParser.stringify(valueNode)
        const isMultiLine = !isSingleLineString(functionString)
        function containsNewline(str) {
          return str.indexOf("\n") !== -1
        }

        // Check opening ...

        const openingIndex = valueNode.sourceIndex + valueNode.value.length + 1

        if (expectation === "always" && !containsNewline(valueNode.before)) {
          complain(messages.expectedOpening, openingIndex)
        }

        if (isMultiLine && expectation === "always-multi-line" && !containsNewline(valueNode.before)) {
          complain(messages.expectedOpeningMultiLine, openingIndex)
        }

        if (isMultiLine && expectation === "never-multi-line" && valueNode.before !== "") {
          complain(messages.rejectedOpeningMultiLine, openingIndex)
        }

        // Check closing ...

        const closingIndex = valueNode.sourceIndex + functionString.length - 2

        if (expectation === "always" && !containsNewline(valueNode.after)) {
          complain(messages.expectedClosing, closingIndex)
        }

        if (isMultiLine && expectation === "always-multi-line" && !containsNewline(valueNode.after)) {
          complain(messages.expectedClosingMultiLine, closingIndex)
        }

        if (isMultiLine && expectation === "never-multi-line" && valueNode.after !== "") {
          complain(messages.rejectedClosingMultiLine, closingIndex)
        }
      })

      function complain(message, offset) {
        report({
          ruleName,
          result,
          message,
          node: decl,
          index: declarationValueIndex(decl) + offset,
        })
      }
    })
  }
}

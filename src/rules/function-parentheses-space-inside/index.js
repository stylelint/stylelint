import {
  isWhitespace,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "function-parentheses-space-inside"

export const messages = ruleMessages(ruleName, {
  expectedOpening: `Expected single space after "("`,
  rejectedOpening: `Unexpected whitespace after "("`,
  expectedClosing: `Expected single space before ")"`,
  rejectedClosing: `Unexpected whitespace before ")"`,
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

    root.walkDecls(decl => {
      const declString = decl.toString()

      styleSearch({ source: declString, target: "(" }, match => {
        checkOpening(declString, match.startIndex, decl)
      })
      styleSearch({ source: declString, target: ")" }, match => {
        checkClosing(declString, match.startIndex, decl)
      })
    })

    function checkOpening(source, index, node) {
      const nextCharIsSpace = source[index + 1] === " "
      if (expectation === "always") {
        if (!nextCharIsSpace || isWhitespace(source[index + 2])) {
          report({
            message: messages.expectedOpening,
            node,
            index: index + 1,
            result,
            ruleName,
          })
        }
      } else if (expectation === "never") {
        if (nextCharIsSpace) {
          report({
            message: messages.rejectedOpening,
            node,
            index: index + 1,
            result,
            ruleName,
          })
        }
      }
    }

    function checkClosing(source, index, node) {
      const prevCharIsSpace = source[index - 1] === " "
      if (expectation === "always") {
        if (!prevCharIsSpace || isWhitespace(source[index - 2])) {
          report({
            message: messages.expectedClosing,
            node,
            index: index - 1,
            result,
            ruleName,
          })
        }
      } else if (expectation === "never") {
        if (prevCharIsSpace) {
          report({
            message: messages.rejectedClosing,
            node,
            index: index - 1,
            result,
            ruleName,
          })
        }
      }
    }
  }
}

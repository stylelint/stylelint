import {
  isWhitespace,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "function-space-after"

export const messages = ruleMessages(ruleName, {
  expected: `Expected single space after ")"`,
  rejected: `Unexpected whitespace after ")"`,
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

      styleSearch({ source: declString, target: ")" }, match => {
        checkClosingParen(declString, match.startIndex, decl)
      })
    })

    function checkClosingParen(source, index, node) {
      const nextChar = source[index + 1]
      if (expectation === "always") {
        // Allow for the next character to be a single empty space,
        // another closing parenthesis, a comma, or the end of the value
        if (nextChar === " " && !isWhitespace(source[index + 2])) { return }
        if ([ ")", ",", undefined ].indexOf(nextChar) !== -1) { return }
        report({
          message: messages.expected,
          node,
          index: index + 1,
          result,
          ruleName,
        })
      } else if (expectation === "never") {
        if (isWhitespace(nextChar)) {
          report({
            message: messages.rejected,
            node,
            index: index + 1,
            result,
            ruleName,
          })
        }
      }
    }
  }
}

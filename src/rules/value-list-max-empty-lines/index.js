import {
  isNumber,
  repeat,
} from "lodash"
import {
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import styleSearch from "style-search"

export const ruleName = "value-list-max-empty-lines"

export const messages = ruleMessages(ruleName, {
  expected: max => `Expected no more than ${max} empty line(s)`,
})

export default function (max) {
  const maxAdjacentNewlines = max + 1

  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: max,
      possible: isNumber,
    })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const value = decl.value
      const repeatLFNewLines = repeat("\n", maxAdjacentNewlines)
      const repeatCRLFNewLines = repeat("\r\n", maxAdjacentNewlines)

      styleSearch({ source: value, target: "\n" }, match => {
        if (
          value.substr(match.startIndex + 1, maxAdjacentNewlines) === repeatLFNewLines
          || value.substr(match.startIndex + 1, maxAdjacentNewlines * 2) === repeatCRLFNewLines
        ) {
          // Put index at `\r` if it's CRLF, otherwise leave it at `\n`
          let index = match.startIndex
          if (value[index - 1] === "\r") { index -= 1 }

          report({
            message: messages.expected(max),
            node: decl,
            index,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions
} from "../../utils"

export const ruleName = "no-multiple-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected empty line at line ${line}`,
})

export default function (o) {
  return (root, result) => {
    validateOptions({ ruleName, result, actual: o })

    let lineCount = 0
    const rootString = root.source.input.css
    styleSearch({ source: rootString, target: "\n", checkComments: true }, match => {
      lineCount++
      if (
        rootString.substr(match.startIndex + 1, 2) === "\n\n"
        || rootString.substr(match.startIndex + 1, 4) === "\r\n\r\n"
      ) {
        const line = lineCount + 2
        report({
          message: messages.rejected(line),
          node: root,
          line: line,
          result,
          ruleName,
        })
      }
    })
  }
}

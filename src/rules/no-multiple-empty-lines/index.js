import {
  report,
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "no-multiple-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected empty line at line ${line}`,
})

export default function () {
  return (root, result) => {
    let lineCount = 0
    const rootString = root.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ], checkComments: true }, match => {
      lineCount++
      if (isNewline(rootString[match.startIndex + 1])
        && isNewline(rootString[match.startIndex + 2])) {
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

function isNewline(char) {
  return char === "\n" || char === "\r"
}

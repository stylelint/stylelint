import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions
} from "../../utils"

export const ruleName = "no-eol-whitespace"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected whitespace at end of line ${line}`,
})

const whitespacesToReject = [ " ", "\t" ]

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual: o })
    if (!validOptions) { return }

    let lineCount = 0
    const rootString = root.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ], checkComments: true }, match => {
      lineCount++
      if (whitespacesToReject.indexOf(rootString[match.startIndex - 1]) !== -1) {
        report({
          message: messages.rejected(lineCount),
          node: root,
          line: lineCount,
          result,
          ruleName,
        })
      }
    })
  }
}

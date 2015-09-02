import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions
} from "../../utils"

export const ruleName = "no-eol-whitespace"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected whitespace at end of line",
})

const whitespacesToReject = [ " ", "\t" ]

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    let lineCount = 0
    const rootString = root.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ], checkComments: true }, match => {
      lineCount++
      if (whitespacesToReject.indexOf(rootString[match.startIndex - 1]) !== -1) {
        report({
          message: messages.rejected,
          node: root,
          index: match.startIndex - 1,
          result,
          ruleName,
        })
      }
    })
  }
}

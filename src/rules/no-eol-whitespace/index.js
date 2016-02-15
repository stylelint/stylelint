import {
  ruleMessages,
  styleSearch,
  report,
  validateOptions,
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

    const rootString = root.toString()
    styleSearch({ source: rootString, target: [ "\n", "\r" ], checkComments: true }, match => {
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

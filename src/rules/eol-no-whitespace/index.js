import {
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "eol-no-whitespace"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected whitespace at end of line ${line}`,
})

const whitespacesToReject = [ " ", "\t" ]

export default function () {
  return function (css, result) {
    let lineCount = 0
    const rootString = css.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ] }, function (index) {
      lineCount++
      if (whitespacesToReject.indexOf(rootString[index - 1]) !== -1) {
        result.warn(messages.rejected(lineCount), { node: css })
      }
    })
  }
}

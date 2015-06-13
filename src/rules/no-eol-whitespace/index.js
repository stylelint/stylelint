import {
  ruleMessages,
  styleSearch,
  report
} from "../../utils"

export const ruleName = "no-eol-whitespace"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected whitespace at end of line ${line}`,
})

const whitespacesToReject = [ " ", "\t" ]

export default function () {
  return function (css, result) {
    let lineCount = 0
    const rootString = css.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ] }, match => {
      lineCount++
      if (whitespacesToReject.indexOf(rootString[match.startIndex - 1]) !== -1) {
        report({
          message: messages.rejected(lineCount),
          node: css,
          line: lineCount,
          result,
          ruleName,
        })
      }
    })
  }
}

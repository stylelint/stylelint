import {
  ruleMessages,
  styleSearch
} from "../../utils"

export const ruleName = "no-multiple-empty-lines"

export const messages = ruleMessages(ruleName, {
  rejected: line => `Unexpected empty line at line ${line}`,
})

export default function () {
  return function (css, result) {
    let lineCount = 0
    const rootString = css.source.input.css
    styleSearch({ source: rootString, target: [ "\n", "\r" ] }, match => {
      lineCount++
      if (isNewline(rootString[match.startIndex + 1])
        && isNewline(rootString[match.startIndex + 2])) {
        result.warn(messages.rejected(lineCount + 2), { node: css })
      }
    })
  }
}

function isNewline(char) {
  return char === "\n" || char === "\r"
}

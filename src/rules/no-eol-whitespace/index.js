import {
  isOnlyWhitespace,
  optionsHaveIgnored,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import styleSearch from "style-search"

export const ruleName = "no-eol-whitespace"

export const messages = ruleMessages(ruleName, {
  rejected: "Unexpected whitespace at end of line",
})

const whitespacesToReject = new Set([ " ", "\t" ])

export default function (on, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: on,
    }, {
      optional: true,
      actual: options,
      possible: {
        ignore: ["empty-lines"],
      },
    })
    if (!validOptions) { return }

    const rootString = root.toString()
    styleSearch({
      source: rootString,
      target: [ "\n", "\r" ],
      comments: "check",
    }, match => {
      // If the character before newline is not whitespace, ignore
      if (!whitespacesToReject.has(rootString[match.startIndex - 1])) { return }

      if (optionsHaveIgnored(options, "empty-lines")) {
        // If there is only whitespace between the previous newline and
        // this newline, ignore
        const lineBefore = rootString.substring(match.startIndex + 1,
          rootString.lastIndexOf("\n", match.startIndex - 1))
        if (isOnlyWhitespace(lineBefore)) { return }
      }

      report({
        message: messages.rejected,
        node: root,
        index: match.startIndex - 1,
        result,
        ruleName,
      })
    })
  }
}

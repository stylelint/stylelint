import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "color-no-hex"

export const messages = ruleMessages(ruleName, {
  rejected: c => `Unexpected hex color "${c}"`,
})

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const declString = decl.toString()

      styleSearch({ source: declString, target: "#" }, match => {
        // If there's not a colon, comma, or whitespace character before, we'll assume this is
        // not intended to be a hex color, but is instead something like the
        // hash in a url() argument
        if (!/[:,\s]/.test(declString[match.startIndex - 1])) { return }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(declString.substr(match.startIndex))
        if (!hexMatch) { return }
        const hexValue = hexMatch[0]

        report({
          message: messages.rejected(hexValue),
          node: decl,
          index: match.startIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

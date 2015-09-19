import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "color-no-invalid-hex"

export const messages = ruleMessages(ruleName, {
  rejected: c => `Unexpected invalid hex color "${c}"`,
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
        // has in a url() argument
        if (!/[:,\s]/.test(declString[match.startIndex - 1])) { return }

        const hexMatch = /^#[0-9A-Za-z]+/.exec(declString.substr(match.startIndex))
        if (!hexMatch) { return }
        const hexValue = hexMatch[0]

        if (!/^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(hexValue)) {
          report({
            message: messages.rejected(hexValue),
            node: decl,
            index: match.startIndex,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

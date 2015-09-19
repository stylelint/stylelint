import {
  isAutoprefixable,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "value-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed value "${p}"`,
})

const valuePrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-" ]

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const declString = decl.toString()
      const { prop } = decl

      // Search the full declaration in order to get an accurate index
      styleSearch({ source: declString, target: valuePrefixes }, match => {
        if (match.startIndex <= prop.length) { return }
        const fullIdentifier = /^(-[a-z-]+)\b/.exec(declString.slice(match.startIndex))[1]
        if (isAutoprefixable.propertyValue(prop, fullIdentifier)) {
          report({
            message: messages.rejected(fullIdentifier),
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

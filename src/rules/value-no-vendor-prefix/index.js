import {
  isAutoprefixable,
  report,
  ruleMessages,
  styleSearch,
  validateOptions
} from "../../utils"

export const ruleName = "value-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed value "${p}"`,
})

const valuePrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-" ]

export default function (o) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: o,
      possible: [],
    })
    if (!validOptions) { return }

    root.eachDecl(decl => {
      const { prop, value } = decl

      styleSearch({ source: value, target: valuePrefixes }, match => {
        const fullIdentifier = /^(-[a-z-]+)\b/.exec(value.slice(match.startIndex))[1]
        if (isAutoprefixable.propertyValue(prop, fullIdentifier)) {
          report({
            message: messages.rejected(fullIdentifier),
            node: decl,
            result,
            ruleName,
          })
        }
      })
    })
  }
}

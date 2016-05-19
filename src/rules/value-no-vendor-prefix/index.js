import {
  isAutoprefixable,
  isStandardDeclaration,
  isStandardProperty,
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../../utils"

export const ruleName = "value-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: property => `Unexpected vendor-prefixed value "${property}"`,
})

const valuePrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-" ]

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      if (
        !isStandardDeclaration(decl)
        || !isStandardProperty(decl.prop)
        || decl.value[0] !== "-"
      ) { return }

      const { prop, value } = decl

      // Search the full declaration in order to get an accurate index
      styleSearch({ source: value.toLowerCase(), target: valuePrefixes }, match => {
        const fullIdentifier = /^(-[a-z-]+)\b/i.exec(value.slice(match.startIndex))[1]
        if (!isAutoprefixable.propertyValue(prop, fullIdentifier)) { return }

        report({
          message: messages.rejected(fullIdentifier),
          node: decl,
          index: prop.length + decl.raws.between.length + match.startIndex,
          result,
          ruleName,
        })
      })
    })
  }
}

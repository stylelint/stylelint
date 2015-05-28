import {
  ruleMessages,
  isAutoprefixable,
  styleSearch
} from "../../utils"

export const ruleName = "property-value-no-vendor-prefix"

export const messages = ruleMessages(ruleName, {
  rejected: p => `Unexpected vendor-prefixed property value "${p}"`,
})

const valuePrefixes = [ "-webkit-", "-moz-", "-ms-", "-o-" ]

export default function () {
  return function (css, result) {
    css.eachDecl(function (decl) {
      const { prop, value } = decl

      styleSearch({ source: value, target: valuePrefixes }, index => {
        const fullIdentifier = /^(-[a-z-]+)\b/.exec(value.slice(index))[1]
        if (isAutoprefixable.propertyValue(prop, fullIdentifier)) {
          result.warn(messages.rejected(fullIdentifier), { node: decl })
        }
      })
    })
  }
}

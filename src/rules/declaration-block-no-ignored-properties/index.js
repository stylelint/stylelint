import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "declaration-block-no-ignored-properties"

export const messages = ruleMessages(ruleName, {
  rejected: (p, v) => `Unexpected ignored property "${p}" with "${v}"`,
})

const ignored = [ {
  property: "display",
  value: "inline",
  ignoredProperties: [
    "width",
    "height",
    "margin",
    "margin-top",
    "margin-bottom",
    "float",
  ],
}, {
  property: "display",
  value: "inline-block",
  ignoredProperties: [
    "float",
  ],
}, {
  property: "display",
  value: "block",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "display",
  value: "/^table.*$/",
  ignoredProperties: [
    "margin",
    "float",
  ],
}, {
  property: "display",
  value: "/^flex.*$/",
  ignoredProperties: [
    "/^columns.*$/",
    "float",
    "clear",
    "vertical-align",
  ],
} ]

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls(decl => {
      const { prop, value } = decl
      const unprefixedProp = vendor.unprefixed(prop)
      const unprefixedValue = vendor.unprefixed(value)

      ignored.forEach(ignore => {
        const matchProperty = matchesStringOrRegExp(unprefixedProp, ignore.property)
        const matchValue = matchesStringOrRegExp(unprefixedValue, ignore.value)

        if (!matchProperty || !matchValue || !decl.parent || ignore.ignoredProperties.length < 1) { return }

        const ignoredProperties = ignore.ignoredProperties

        // Todo ignore self
        decl.parent.nodes.forEach((node) => {
          if (ignoredProperties.indexOf(node.prop) === -1) { return }

          report({
            message: messages.rejected(node.prop, decl.toString()),
            node,
            result,
            ruleName,
          })
        })
      })
    })
  }
}

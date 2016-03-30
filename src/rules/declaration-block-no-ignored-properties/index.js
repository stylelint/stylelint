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
  value: "/^table-.*$/",
  ignoredProperties: [
    "margin",
    "margin-top",
    "margin-right",
    "margin-bottom",
    "margin-left",
    "float",
  ],
}, {
  property: "position",
  value: "static",
  ignoredProperties: [
    "top",
    "right",
    "bottom",
    "left",
  ],
}, {
  property: "position",
  value: "absolute",
  ignoredProperties: [
    "float",
  ],
}, {
  property: "position",
  value: "fixed",
  ignoredProperties: [
    "float",
  ],
} ]

export default function (actual) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual })
    if (!validOptions) { return }

    root.walkDecls((decl, index) => {
      const { prop, value } = decl
      const unprefixedProp = vendor.unprefixed(prop)
      const unprefixedValue = vendor.unprefixed(value)

      ignored.forEach(ignore => {
        const matchProperty = matchesStringOrRegExp(unprefixedProp, ignore.property)
        const matchValue = matchesStringOrRegExp(unprefixedValue, ignore.value)

        if (!matchProperty || !matchValue || !decl.parent) { return }

        const ignoredProperties = ignore.ignoredProperties

        decl.parent.nodes.forEach((node, nodeIndex) => {
          if (index === nodeIndex) { return }
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

import { vendor } from "postcss"
import {
  report,
  ruleMessages,
  validateOptions,
  matchesStringOrRegExp,
} from "../../utils"

export const ruleName = "declaration-block-no-ignored-properties"

export const messages = ruleMessages(ruleName, {
  rejected: (ignored, cause) => `Unexpected "${ignored}" with "${cause}"`,
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
  value: "list-item",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "display",
  value: "block",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "display",
  value: "flex",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "display",
  value: "table",
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
  ],
}, {
  property: "display",
  value: "/^table-(row|row-group|column|column-group|header-group|footer-group|caption).*$/",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "float",
  value: "left",
  ignoredProperties: [
    "vertical-align",
  ],
}, {
  property: "float",
  value: "right",
  ignoredProperties: [
    "vertical-align",
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
    "clear",
    "vertical-align",
  ],
}, {
  property: "position",
  value: "fixed",
  ignoredProperties: [
    "float",
    "clear",
    "vertical-align",
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
        const matchProperty = matchesStringOrRegExp(unprefixedProp.toLowerCase(), ignore.property)
        const matchValue = matchesStringOrRegExp(unprefixedValue.toLowerCase(), ignore.value)

        if (!matchProperty || !matchValue) { return }

        const ignoredProperties = ignore.ignoredProperties

        decl.parent.nodes.forEach((node, nodeIndex) => {
          if (!node.prop || ignoredProperties.indexOf(node.prop.toLowerCase()) === -1 || index === nodeIndex) { return }

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

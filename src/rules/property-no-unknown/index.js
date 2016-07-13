import {
  isArray,
  isString,
} from "lodash"
import {
  isCustomProperty,
  isStandardSyntaxProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { all as properties } from "known-css-properties"

export const ruleName = "property-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (property) => `Unexpected unknown property "${property}"`,
})

export default function (actual, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, { actual }, {
      actual: options,
      possible: {
        ignoreProperties: [isString],
      },
      optional: true,
    })

    if (!validOptions) { return }

    root.walkDecls(node => {
      const { prop } = node

      if (!isStandardSyntaxProperty(prop)) { return }
      if (isCustomProperty(prop)) { return }

      const ignoreProperties = options && options.ignoreProperties || []
      if (isArray(ignoreProperties) && ignoreProperties.indexOf(prop.toLowerCase()) !== -1) { return }

      if (properties.indexOf(prop.toLowerCase()) !== -1) { return }

      report({
        message: messages.rejected(node.prop),
        node,
        result,
        ruleName,
      })
    })
  }
}

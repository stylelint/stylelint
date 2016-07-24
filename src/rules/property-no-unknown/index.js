import {
  isCustomProperty,
  isStandardSyntaxProperty,
  optionsHaveIgnoredProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { isString } from "lodash"
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

    root.walkDecls(decl => {
      const { prop } = decl

      if (!isStandardSyntaxProperty(prop)) { return }
      if (isCustomProperty(prop)) { return }

      if (optionsHaveIgnoredProperty(options, prop)) { return }

      if (properties.indexOf(prop.toLowerCase()) !== -1) { return }

      report({
        message: messages.rejected(prop),
        node: decl,
        result,
        ruleName,
      })
    })
  }
}

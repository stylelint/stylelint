import {
  isString,
  isArray,
  isBoolean,
} from "lodash"
import {
  isStandardSyntaxProperty,
  isCustomProperty,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"
import { all as properties } from "known-css-properties"

export const ruleName = "property-no-unknown"

export const messages = ruleMessages(ruleName, {
  rejected: (property) => `Unexpected unknown property "${property}"`,
})

const isPropertyIgnored = (prop, ignore) => {
  if (isArray(ignore)) {
    return ignore.indexOf(prop) > -1
  }

  if (isString(ignore)) {
    return prop === ignore
  }

  return false
}

const isPropertyValid = (prop) => {
  return properties.indexOf(prop) > -1
}

const validate = (result, options) => {
  return function (node) {
    const prop = node.prop

    if (!isStandardSyntaxProperty(prop)) { return }
    if (isCustomProperty(prop)) { return }
    if (isPropertyIgnored(prop, options.ignoreProperties)) { return }
    if (isPropertyValid(prop)) { return }

    report({
      message: messages.rejected(node.prop),
      node,
      result,
      ruleName,
    })
  }
}

export default function (enabled, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: enabled,
      possible: isBoolean,
    }, {
      actual: options,
      possible: {
        ignoreProperties: [isString],
      },
      optional: true,
    })

    if (!validOptions) { return }
    if (!enabled) { return }
    if (!options) { options = {} }

    root.walkDecls(validate(result, options))
  }
}


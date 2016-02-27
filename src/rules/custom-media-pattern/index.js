import { isRegExp, isString } from "lodash"
import {
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "custom-media-pattern"

export const messages = ruleMessages(ruleName, {
  expected: "Expected custom media query name to match specified pattern",
})

export default function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) { return }

    const regexpPattern = (isString(pattern))
      ? new RegExp(pattern)
      : pattern

    root.walkAtRules(atRule => {
      if (atRule.name !== "custom-media") { return }

      const customMediaName = atRule.params.match(/^--(\S+)\b/)[1]

      if (!regexpPattern.test(customMediaName)) {
        report({
          message: messages.expected,
          node: atRule,
          index: mediaQueryParamIndexOffset(atRule),
          result,
          ruleName,
        })
      }
    })
  }
}

import { isRegExp } from "lodash"
import {
  report,
  ruleMessages,
  validateOptions
} from "../../utils"

export const ruleName = "custom-media-pattern"

export const messages = ruleMessages(ruleName, {
  expected: `Expected custom media query name to match specified pattern`,
})

export default function (pattern) {
  return (root, result) => {
    validateOptions({ result, ruleName, actual: pattern, possible: isRegExp })

    root.eachAtRule(atRule => {
      if (atRule.name !== "custom-media") { return }

      const customMediaName = atRule.params.match(/^--(\S+)\b/)[1]

      if (!pattern.test(customMediaName)) {
        report({
          message: messages.expected,
          node: atRule,
          result,
          ruleName,
        })
      }
    })
  }
}

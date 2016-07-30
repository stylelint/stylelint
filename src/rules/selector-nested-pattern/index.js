import {
  isRegExp,
  isString,
} from "lodash"
import {
  isStandardSyntaxRule,
  isStandardSyntaxSelector,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

export const ruleName = "selector-nested-pattern"

export const messages = ruleMessages(ruleName, {
  expected: selector => `Expected nested selector "${selector}" to match specified pattern`,
})

export default function (pattern) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: pattern,
      possible: [ isRegExp, isString ],
    })
    if (!validOptions) { return }

    const normalizedPattern = isString(pattern) ? new RegExp(pattern) : pattern

    root.walkRules(rule => {
      if (rule.parent.type !== "rule") { return }
      if (!isStandardSyntaxRule(rule)) { return }

      const { selector } = rule
      if (!isStandardSyntaxSelector(selector)) { return }

      if (normalizedPattern.test(selector)) { return }

      report({
        result,
        ruleName,
        message: messages.expected(selector),
        node: rule,
      })
    })
  }
}

import {
  isStandardSyntaxRule,
  ruleMessages,
  validateOptions,
} from "../../utils"

import { checkRuleEmptyLineBefore } from "../rule-non-nested-empty-line-before"

export const ruleName = "rule-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before nested rule",
  rejected: "Unexpected empty line before nested rule",
})

export default function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-multi-line",
        "never-multi-line",
      ],
    }, {
      actual: options,
      possible: {
        ignore: [
          "after-comment",
        ],
        except: [
          "first-nested",
          "after-comment",
        ],
      },
      optional: true,
    })
    if (!validOptions) { return }

    root.walkRules(rule => {

      if (!isStandardSyntaxRule(rule)) { return }

      // Only attend to nested rule sets
      if (rule.parent === root) { return }

      checkRuleEmptyLineBefore({ rule, expectation, options, result, messages, checkedRuleName: ruleName })
    })
  }
}

import {
  ruleMessages
} from "../../utils"

import { checkRuleEmptyLineBefore } from "../rule-set-non-nested-empty-line-before"

export const ruleName = "rule-set-nested-empty-line-before"

export const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before nested rule set",
  rejected: "Unexpected empty line before nested rule set",
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  return (root, result) => {
    root.eachRule(rule => {

      // Only attend to nested rule sets
      if (rule.parent === root) { return }

      checkRuleEmptyLineBefore(rule, expectation, result, messages)
    })
  }
}

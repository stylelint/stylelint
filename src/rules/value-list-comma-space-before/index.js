import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { valueListCommaWhitespaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \",\"",
  rejectedBefore: () => "Unexpected whitespace before \",\"",
  expectedBeforeSingleLine: () => "Unexpected whitespace before \",\" in a single-line list",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \",\" in a single-line list",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-single-line",
        "never-single-line",
      ],
    })
    if (!validOptions) { return }

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
    })
  }
}

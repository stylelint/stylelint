import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { functionCommaSpaceChecker } from "../function-comma-space-after"

export const ruleName = "function-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \",\"",
  rejectedBefore: () => "Unexpected whitespace before \",\"",
  expectedBeforeSingleLine: () => "Expected single space before \",\" in a single-line function",
  rejectedBeforeSingleLine: () => "Unexpected whitespace before \",\" in a single-line function",
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

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.before,
      checkedRuleName: ruleName,
    })
  }
}

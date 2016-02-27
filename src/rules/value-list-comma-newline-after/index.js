import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { valueListCommaWhitespaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \",\"",
  expectedAfterMultiLine: () => "Expected newline after \",\" in a multi-line list",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \",\" in a multi-line list",
})

export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })
    if (!validOptions) { return }

    valueListCommaWhitespaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName,
    })
  }
}

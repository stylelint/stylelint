import {
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { functionCommaSpaceChecker } from "../function-comma-space-after"

export const ruleName = "function-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after \",\"",
  expectedAfterMultiLine: () => "Expected newline after \",\" in a multi-line function",
  rejectedAfterMultiLine: () => "Unexpected whitespace after \",\" in a multi-line function",
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

    functionCommaSpaceChecker({
      root,
      result,
      locationChecker: checker.afterOneOnly,
      checkedRuleName: ruleName,
    })
  }
}

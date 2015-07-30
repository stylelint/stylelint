import {
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"
import { valueListCommaWhitespaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ","`,
  expectedBeforeMultiLine: () => `Expected newline before "," in a multi-line list`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "," in a multi-line list`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return (root, result) => {
    validateOptions({ ruleName, result,
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })

    valueListCommaWhitespaceChecker(checker.beforeAllowingIndentation, root, result)
  }
}

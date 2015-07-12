import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { valueListCommaWhitespaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  expectedAfterMultiLine: () => `Expected newline after "," in a multi-line list`,
  rejectedAfterMultiLine: () => `Unexpected whitespace after "," in a multi-line list`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("newline", expectation, messages)
  return valueListCommaWhitespaceChecker(checker.afterOneOnly)
}

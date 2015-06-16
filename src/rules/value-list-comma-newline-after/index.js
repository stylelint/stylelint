import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { valueListCommaSpaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  rejectedAfter: () => `Unexpected space after ","`,
  expectedAfterMultiLine: () => `Expected newline after "," in multi-line value`,
  rejectedAfterMultiLine: () => `Unexpected space after "," in multi-line value`,
})

/**
 * @param {"always"|"never"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return valueListCommaSpaceChecker(checker.afterOneOnly)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { valueListCommaSpaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ","`,
  expectedBeforeMultiLine: () => `Expected newline before "," in multi-line value`,
  rejectedBeforeMultiLine: () => `Unexpected space before "," in multi-line value`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return valueListCommaSpaceChecker(checker.before)
}

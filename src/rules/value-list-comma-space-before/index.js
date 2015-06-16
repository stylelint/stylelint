import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { valueListCommaSpaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected space before ","`,
  expectedBeforeSingleLine: () => `Unexpected space before "," in a single-line value`,
  rejectedBeforeSingleLine: () => `Unexpected space before "," in a single-line value`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return valueListCommaSpaceChecker(checker.before)
}

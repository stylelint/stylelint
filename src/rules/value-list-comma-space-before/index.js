import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { valueListCommaSpaceChecker } from "../value-list-comma-space-after"

export const ruleName = "value-list-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected whitespace before ","`,
  expectedBeforeSingleLine: () => `Unexpected whitespace before "," in a single-line list`,
  rejectedBeforeSingleLine: () => `Unexpected whitespace before "," in a single-line list`,
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return valueListCommaSpaceChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { functionCommaSpaceChecker } from "../function-comma-space-after"

export const ruleName = "function-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected whitespace before ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return functionCommaSpaceChecker(checker.before)
}

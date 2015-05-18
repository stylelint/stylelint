import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { declarationCommaSpaceChecker } from "../declaration-comma-space-after"

export const ruleName = "declaration-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before comma within a declaration value`,
  rejectedBefore: () => `Unexpected space before comma within a declaration value`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationCommaSpaceChecker(checker.before)
}

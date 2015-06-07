import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { declarationCommaSpaceChecker } from "../declaration-comma-space-after"

export const ruleName = "declaration-comma-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected space before ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationCommaSpaceChecker(checker.before)
}

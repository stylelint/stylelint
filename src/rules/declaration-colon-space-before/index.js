import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { declarationColonSpaceChecker } from "../declaration-colon-space-after"

export const ruleName = "declaration-colon-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ":"`,
  rejectedBefore: () => `Unexpected space before comma ":"`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationColonSpaceChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { declarationBangSpaceChecker } from "../declaration-bang-space-after"

export const ruleName = "declaration-bang-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"!\"",
  rejectedBefore: () => "Unexpected whitespace before \"!\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return declarationBangSpaceChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { blockOpeningBraceSpaceChecker } from "../block-opening-brace-space-after"

export const ruleName = "block-opening-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"{\"",
  rejectedBefore: () => "Unexpected space before \"{\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return blockOpeningBraceSpaceChecker(checker.before)
}

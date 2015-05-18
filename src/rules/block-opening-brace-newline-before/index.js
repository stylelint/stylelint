import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { blockOpeningBraceNewlineChecker } from "../block-opening-brace-newline-after"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single newline before \"{\"",
  rejectedBefore: () => "Unexpected newline before \"{\"",
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return blockOpeningBraceNewlineChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { blockOpeningBraceNewlineChecker } from "../block-opening-brace-newline-after"

export const ruleName = "block-opening-brace-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected newline before \"{\"",
  rejectedBefore: () => "Unexpected newline before \"{\"",
  expectedBeforeSingleLine: () => "Expected newline before \"{\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected space before \"{\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected newline before \"{\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected space before \"{\" of a multi-line block",
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return blockOpeningBraceNewlineChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { blockOpeningBraceSpaceChecker } from "../block-opening-brace-space-after"

export const ruleName = "block-opening-brace-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before \"{\"",
  rejectedBefore: () => "Unexpected space before \"{\"",
  expectedBeforeSingleLine: () => "Expected single space before \"{\" of a single-line block",
  rejectedBeforeSingleLine: () => "Unexpected space before \"{\" of a single-line block",
  expectedBeforeMultiLine: () => "Expected single space before \"{\" of a multi-line block",
  rejectedBeforeMultiLine: () => "Unexpected space before \"{\" of a multi-line block",
})

/**
 * @param {"always"|"never"|"always-single-line"|"never-single-line"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return blockOpeningBraceSpaceChecker(checker.before)
}

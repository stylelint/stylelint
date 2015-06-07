import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { mediaQueryListCommaChecker } from "../media-query-list-comma-space-after"

export const ruleName = "media-query-list-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected space before ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return mediaQueryListCommaChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { mediaQueryListCommaChecker } from "../media-query-list-comma-space-after"

export const ruleName = "media-query-list-comma-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected newline after ","`,
  rejectedAfter: () => `Unexpected space after ","`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)

  // Only check for the newline after the comma, while allowing
  // arbitrary indentation after the newline
  return mediaQueryListCommaChecker(checker.afterOneOnly)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { selectorDelimiterSpaceChecker } from "../selector-delimiter-space-after"

export const ruleName = "selector-delimiter-newline-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => "Expected newline after selector delimiter",
  rejectedAfter: () => "Unexpected space after selector delimiter",
})
/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return selectorDelimiterSpaceChecker(checker.after)
}

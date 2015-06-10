import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { selectorDelimiterSpaceChecker } from "../selector-delimiter-space-after"

export const ruleName = "selector-delimiter-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before selector delimiter",
  rejectedBefore: () => "Unexpected space before selector delimiter",
})
/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return selectorDelimiterSpaceChecker(checker.before)
}

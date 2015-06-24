import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { selectorDelimiterSpaceChecker } from "../selector-delimiter-space-after"

export const ruleName = "selector-delimiter-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before ","`,
  rejectedBefore: () => `Unexpected space before ","`,
  expectedBeforeSingleLine: () => `Expected single space before "," in a single-line selector`,
  rejectedBeforeSingleLine: () => `Unexpected space before "," in a single-line selector`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return selectorDelimiterSpaceChecker(checker.before)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { selectorDelimiterSpaceChecker } from "../selector-delimiter-space-after"

export const ruleName = "selector-delimiter-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ","`,
  expectedBeforeMultiLine: () => `Expected newline before "," in multi-line selector`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before "," in multi-line selector`,
})

/**
 * @param {"always"|"always-multi-line"|"never-multi-line"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("\n", expectation, messages)
  return selectorDelimiterSpaceChecker(checker.beforeAllowingIndentation)
}

import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { selectorCombinatorSpaceChecker } from "../selector-combinator-space-after"

export const ruleName = "selector-combinator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: c => `Expected single space before "${c}" combinator`,
  rejectedBefore: c => `Unexpected whitespace before "${c}" combinator`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return selectorCombinatorSpaceChecker(checker.before)
}

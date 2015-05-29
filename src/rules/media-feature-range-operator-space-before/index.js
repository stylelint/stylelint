import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"
import { findMediaOperator } from "../media-feature-range-operator-space-after"

export const ruleName = "media-feature-range-operator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before range operator in media feature`,
  rejectedBefore: () => `Unexpected space before range operator in media feature`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return (css, result) => {
    css.eachAtRule(atRule => {
      findMediaOperator(atRule, checkBeforeOperator)
    })

    function checkBeforeOperator(match, params, node) {
      // The extra `+ 1` is because the match itself contains
      // the character before the operator
      checker.before(params, match.index + 1, m => {
        result.warn(m, { node })
      })
    }
  }
}

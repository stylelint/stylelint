import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

import { findMediaOperator } from "../media-feature-range-operator-space-after"

export const ruleName = "media-feature-range-operator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected single space before range operator`,
  rejectedBefore: () => `Unexpected whitespace before range operator`,
})

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    root.eachAtRule(atRule => {
      findMediaOperator(atRule, checkBeforeOperator)
    })

    function checkBeforeOperator(match, params, node) {
      // The extra `+ 1` is because the match itself contains
      // the character before the operator
      checker.before({
        source: params,
        index: match.index + 1,
        err: m => {
          report({
            message: m,
            node: node,
            result,
            ruleName,
          })
        },
      })
    }
  }
}

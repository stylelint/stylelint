import {
  mediaQueryParamIndexOffset,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker,
} from "../../utils"

import { findMediaOperator } from "../media-feature-range-operator-space-after"

export const ruleName = "media-feature-range-operator-space-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => "Expected single space before range operator",
  rejectedBefore: () => "Unexpected whitespace before range operator",
})

export default function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
      ],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
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
            node,
            index: match.index + mediaQueryParamIndexOffset(node),
            result,
            ruleName,
          })
        },
      })
    }
  }
}

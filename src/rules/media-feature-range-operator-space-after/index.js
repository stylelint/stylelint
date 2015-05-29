import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "media-feature-range-operator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: () => `Expected single space after range operator in media feature`,
  rejectedAfter: () => `Unexpected space after range operator in media feature`,
})

const rangeOperatorRegex = /[^><](>=?|<=?|=)/g

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return (css, result) => {
    css.eachAtRule(atRule => {
      const params = atRule.params
      let match
      while ((match = rangeOperatorRegex.exec(params)) !== null) {
        checkOperator(match, params, atRule)
      }
    })

    function checkOperator(match, params, node) {
      checker.after(params, match.index + match[1].length, m => {
        result.warn(m, { node })
      })
    }
  }
}

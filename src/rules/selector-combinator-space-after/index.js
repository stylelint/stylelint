import {
  report,
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-combinator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: c => `Expected single space after "${c}" combinator `,
  rejectedAfter: c => `Unexpected whitespace after "${c}" combinator`,
})

const combinators = [ ">", "+", "~" ]

/**
 * @param {"always"|"never"} expectation
 */
export default function (expectation) {
  const checker = whitespaceChecker(" ", expectation, messages)
  return selectorCombinatorSpaceChecker(checker.after)
}

export function selectorCombinatorSpaceChecker(locationChecker) {
  return function (css, result) {
    css.eachRule(function (rule) {
      const selector = rule.selector
      for (let i = 0, l = selector.length; i < l; i++) {
        if (combinators.indexOf(selector[i]) === -1) { continue }
        check(selector, i, rule)
      }
    })

    function check(source, index, node) {
      locationChecker({ source, index, err: m =>
        report({
          message: m,
          node: node,
          result,
          ruleName,
        }),
      })
    }
  }
}

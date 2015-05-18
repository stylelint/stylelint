import {
  ruleMessages,
  whitespaceChecker
} from "../../utils"

export const ruleName = "selector-combinator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: c => `Expected single space after combinator "${c}"`,
  rejectedAfter: c => `Unexpected space after combinator "${c}"`,
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

    function check(str, index, node) {
      locationChecker(str, index, m => result.warn(m, { node }))
    }
  }
}

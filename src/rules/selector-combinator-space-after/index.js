import {
  report,
  ruleMessages,
  styleSearch,
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
  const checker = whitespaceChecker("space", expectation, messages)
  return selectorCombinatorSpaceChecker(checker.after)
}

export function selectorCombinatorSpaceChecker(locationChecker) {
  return (root, result) => {
    root.eachRule(rule => {
      const selector = rule.selector
      styleSearch({
        source: selector,
        target: combinators,
        outsideFunctionalNotation: true,
      }, match => {
        // Catch ~= in attribute selectors
        if (match.target === "~" && selector[match.endIndex] === "=") { return }

        check(selector, match.startIndex, rule)
      })
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

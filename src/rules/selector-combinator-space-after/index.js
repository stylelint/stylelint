import _ from "lodash"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
  whitespaceChecker,
} from "../../utils"
import { nonSpaceCombinators } from "../../reference/punctuationSets"

export const ruleName = "selector-combinator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: combinator => `Expected single space after "${combinator}" combinator`,
  rejectedAfter: combinator => `Unexpected whitespace after "${combinator}" combinator`,
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

    selectorCombinatorSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function selectorCombinatorSpaceChecker({ locationChecker, root, result, checkedRuleName }) {
  root.walkRules(rule => {
    // Check each selector individually, instead of all as one string,
    // in case some that aren't the first begin with combinators (nesting syntax)
    rule.selectors.forEach(selector => {
      styleSearch({
        source: selector,
        target: _.toArray(nonSpaceCombinators),
        outsideFunctionalNotation: true,
      }, match => {
        // Catch ~= in attribute selectors
        if (match.target === "~" && selector[match.endIndex] === "=") { return }

        check(selector, match.startIndex, rule)
      })
    })
  })

  function check(source, index, node) {
    locationChecker({ source, index, err: m =>
      report({
        message: m,
        node,
        index,
        result,
        ruleName: checkedRuleName,
      }),
    })
  }
}

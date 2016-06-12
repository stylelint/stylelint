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
  expectedAfter: combinator => `Expected single space after "${combinator}"`,
  rejectedAfter: combinator => `Unexpected whitespace after "${combinator}"`,
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

        const { endIndex, startIndex, target } = match

        // Catch ~= in attribute selectors
        if (target === "~" && selector[endIndex] === "=") { return }

        // Catch escaped combinator-like character
        if (selector[startIndex - 1] === "\\") { return }

        check(selector, startIndex, rule)
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

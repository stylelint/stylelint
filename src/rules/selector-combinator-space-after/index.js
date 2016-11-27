const report = require("../../utils/report")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const whitespaceChecker = require("../../utils/whitespaceChecker")
const _ = require("lodash")
import { nonSpaceCombinators } from "../../reference/punctuationSets"
const styleSearch = require("style-search")

export const ruleName = "selector-combinator-space-after"

export const messages = ruleMessages(ruleName, {
  expectedAfter: combinator => `Expected single space after "${combinator}"`,
  rejectedAfter: combinator => `Unexpected whitespace after "${combinator}"`,
})

module.exports = function (expectation) {
  const checker = whitespaceChecker("space", expectation, messages)
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [ "always", "never" ],
    })
    if (!validOptions) {
      return
    }

    selectorCombinatorSpaceChecker({
      root,
      result,
      locationChecker: checker.after,
      checkedRuleName: ruleName,
    })
  }
}

export function selectorCombinatorSpaceChecker(_ref) {
  let locationChecker = _ref.locationChecker,
    root = _ref.root,
    result = _ref.result,
    checkedRuleName = _ref.checkedRuleName

  root.walkRules(rule => {
    // Check each selector individually, instead of all as one string,
    // in case some that aren't the first begin with combinators (nesting syntax)
    rule.selectors.forEach(selector => {
      styleSearch({
        source: selector,
        target: _.toArray(nonSpaceCombinators),
        parentheticals: "skip",
      }, match => {
        const endIndex = match.endIndex,
          startIndex = match.startIndex,
          target = match.target

        // Catch ~= in attribute selectors

        if (target === "~" && selector[endIndex] === "=") {
          return
        }

        // Catch escaped combinator-like character
        if (selector[startIndex - 1] === "\\") {
          return
        }

        check(selector, startIndex, rule)
      })
    })
  })

  function check(source, index, node) {
    locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index,
      result,
      ruleName: checkedRuleName,
    }),
    })
  }
}

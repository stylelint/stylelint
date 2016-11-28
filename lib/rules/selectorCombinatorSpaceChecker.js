"use strict"

const report = require("../utils/report")
const _ = require("lodash")
const punctuationSets = require("../reference/punctuationSets")
const styleSearch = require("style-search")

module.exports = function (opts) {
  opts.root.walkRules(rule => {
    // Check each selector individually, instead of all as one string,
    // in case some that aren't the first begin with combinators (nesting syntax)
    rule.selectors.forEach(selector => {
      styleSearch({
        source: selector,
        target: _.toArray(punctuationSets.nonSpaceCombinators),
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
    opts.locationChecker({ source, index, err: m => report({
      message: m,
      node,
      index,
      result: opts.result,
      ruleName: opts.checkedRuleName,
    }),
    })
  }
}

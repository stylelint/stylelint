"use strict"

const createRuleTester = require("./createRuleTester")
const test = require("tape")

// This code is included here instead of using stylelint-test-rule-tape
// because tests performs significantly faster this way
function assertEquality(processCss, context) {
  const testFn = context.only ? test.only : test
  testFn(context.caseDescription, t => {
    t.plan(context.comparisonCount)
    processCss.then(comparisons => {
      comparisons.forEach((comparison) => {
        t.equal(comparison.actual, comparison.expected, comparison.description)
      })
    })
  })
}

module.exports = createRuleTester(assertEquality)

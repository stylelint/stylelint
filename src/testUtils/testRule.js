import createRuleTester from "./createRuleTester"
import test from "tape"

// This code is included here instead of using stylelint-test-rule-tape
// because tests performs significantly faster this way
function assertEquality(processCss, context) {
  const testFn = (context.only) ? test.only : test
  testFn(context.caseDescription, t => {
    t.plan(context.comparisonCount)
    processCss.then((comparisons) => {
      comparisons.forEach(({ actual, expected, description }) => {
        t.equal(actual, expected, description)
      })
    })
  })
}

export default createRuleTester(assertEquality)

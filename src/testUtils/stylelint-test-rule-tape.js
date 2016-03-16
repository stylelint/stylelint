import createStylelintRuleTester from "./createStylelintRuleTester"
import test from "tape"

function assertEquality(processCss, context) {
  test(context.caseDescription, t => {
    t.plan(context.comparisonCount)
    processCss.then((comparisons) => {
      comparisons.forEach(({ actual, expected, description }) => {
        t.equal(actual, expected, description)
      })
    })
  })
}

export default createStylelintRuleTester(assertEquality)

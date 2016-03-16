import createStylelintRuleTester from "./createStylelintRuleTester"
import test from "ava"

function assertEquality(processCss, context) {
  test(context.caseDescription, t => {
    return processCss.then((comparisons) => {
      comparisons.forEach(({ actual, expected, description }) => {
        t.is(actual, expected, description)
      })
    })
  })
}

export default createStylelintRuleTester(assertEquality)

import createStylelintAssert from "./createStylelintAssert"
import test from "ava"

function assertEquality(resultPromise, context) {
  test(context.caseDescription, t => {
    return resultPromise.then((comparisons) => {
      comparisons.forEach(({ actual, expected, description }) => {
        t.is(actual, expected, description)
      })
    })
  })
}

export default createStylelintAssert(assertEquality)

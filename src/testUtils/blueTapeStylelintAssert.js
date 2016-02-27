import createStylelintAssert from "./createStylelintAssert"
import test from "blue-tape"

function assertEquality(resultPromise, context) {
  test(context.caseDescription, t => {
    return resultPromise.then((comparisons) => {
      comparisons.forEach(({ actual, expected, description }) => {
        t.equal(actual, expected, description)
      })
    })
  })
}

export default createStylelintAssert(assertEquality)

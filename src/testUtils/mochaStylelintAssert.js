import createStylelintAssert from "./createStylelintAssert"
import assert from "assert"

function assertEquality(resultPromise, context) {
  describe(context.caseDescription, () => {
    it(context.completeAssertionDescription, done => {
      resultPromise.then((comparisons) => {
        comparisons.forEach(({ actual, expected, description }) => {
          assert.equal(actual, expected, description)
        })
        done()
      }).catch(done)
    })
  })
}

export default createStylelintAssert(assertEquality)

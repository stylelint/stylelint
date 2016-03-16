/* eslint-disable no-undef */
import createStylelintRuleTester from "./createStylelintRuleTester"
import assert from "assert"

function assertEquality(processCss, context) {
  describe(context.caseDescription, () => {
    it(context.completeAssertionDescription, done => {
      processCss.then((comparisons) => {
        comparisons.forEach(({ actual, expected, description }) => {
          assert.equal(actual, expected, description)
        })
        done()
      }).catch(done)
    })
  })
}

export default createStylelintRuleTester(assertEquality)

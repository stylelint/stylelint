const createRuleTester = require("./createRuleTester")
const test = require("tape")

// This code is included here instead of using stylelint-test-rule-tape
// because tests performs significantly faster this way
function assertEquality(processCss, context) {
  const testFn = context.only ? test.only : test
  testFn(context.caseDescription, t => {
    t.plan(context.comparisonCount)
    processCss.then(comparisons => {
      comparisons.forEach((_ref) => {
        let actual = _ref.actual,
          expected = _ref.expected,
          description = _ref.description

        t.equal(actual, expected, description)
      })
    })
  })
}

module.exports = createRuleTester(assertEquality)

"use strict"

const sinon = require("sinon")
const createRuleTester = require("../createRuleTester")

function createRuleTesterPromise(rule, schema) {
  const assertions = []
  return new Promise((resolve, reject) => {
    const ruleTester = createRuleTester((promise, res) => {
      assertions.push(res)
      promise.then(resolve, reject)
    })
    ruleTester(rule, schema)
  }).then(() => assertions)
}

describe("createRuleTester", () => {

  it("is possible to create a tester", () => {
    const schema = {
      ruleName: "my-test-rule",
      accept: [],
    }

    const rule = sinon.spy((root, result) => {
      expect(root).toBeDefined()
      expect(result).toBeDefined()
    })

    return createRuleTesterPromise(() => rule, schema)
      .then(assertions => {
        expect(assertions).toEqual(
          [
            { comparisonCount: 1,
              caseDescription: "\n> rule: my-test-rule\n> config: \n> code: \"\"\n",
              completeAssertionDescription: "empty stylesheet should be accepted" },
            { comparisonCount: 1,
              caseDescription: "\n> rule: my-test-rule\n> config: \n> code: \"a {}\"\n",
              completeAssertionDescription: "empty rule should be accepted" },
            { comparisonCount: 1,
              caseDescription: "\n> rule: my-test-rule\n> config: \n> code: \"@import \\\"foo.css\\\";\"\n",
              completeAssertionDescription: "blockless statement should be accepted" },
            { comparisonCount: 1,
              caseDescription: "\n> rule: my-test-rule\n> config: \n> code: \":global {}\"\n",
              completeAssertionDescription: "CSS Modules global empty rule set should be accepted" },
          ]
        )
        expect(rule.callCount).toEqual(4);
      })
  })

  it("is possible to pass preceeding plugins to a tester", () => {
    const postCssPlugin = sinon.spy((id) => id)
    const schema = {
      preceedingPlugins: [postCssPlugin],
    }

    return createRuleTesterPromise(() => () => {}, schema)
      .then(() => {
        expect(postCssPlugin.callCount).toEqual(4)
      })
  })
})

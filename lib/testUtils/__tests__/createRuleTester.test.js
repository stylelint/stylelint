"use strict"

const createRuleTester = require("../createRuleTester")

describe("createRuleTester", () => {
  it("is possible to create a tester", () => {
    const results = []
    return new Promise((resolve, reject) => {
      const tester = createRuleTester((promise, res) => {
        results.push(res)
        promise.then(resolve, reject)
      })

      const schema = {
        ruleName: "my-test-rule",
        preceedingPlugins: [(id) => id],
        accept: [],
      }

      const rule = () => (root, result) => {
        expect(root).toBeDefined()
        expect(result).toBeDefined()
      }

      tester(rule, schema)
    }).then(() => {
      expect(results).toEqual(
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
    })
  })
})

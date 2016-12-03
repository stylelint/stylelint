"use strict"

const _ = require("lodash")
const basicChecks = require("./lib/testUtils/basicChecks")
const stylelint = require("./lib/standalone")

global.testRule = (rule, schema) => {
  describe(schema.ruleName, () => {
    const stylelintConfig = {
      rules: {
        [schema.ruleName]: schema.config,
      },
    }

    let passingTestCases = schema.accept || []
    if (!schema.skipBasicChecks) {
      passingTestCases = passingTestCases.concat(basicChecks)
    }

    if (passingTestCases && passingTestCases.length) {
      describe("accept", () => {
        passingTestCases.forEach((testCase) => {
          const spec = (testCase.only) ? it.only : it
          spec(testCase.description || "no description", () => {
            return stylelint({
              code: testCase.code,
              config: stylelintConfig,
              syntax: schema.syntax,
            }).then((output) => {
              expect(output.results[0].warnings).toEqual([])
            })
          })
        })
      })
    }

    if (schema.reject && schema.reject.length) {
      describe("reject", () => {
        schema.reject.forEach((testCase) => {
          const spec = (testCase.only) ? it.only : it
          spec(testCase.description || "no description", () => {
            return stylelint({
              code: testCase.code,
              config: stylelintConfig,
              syntax: schema.syntax,
            }).then((output) => {
              const warning = output.results[0].warnings[0]
              if (testCase.message) {
                expect(_.get(warning, "text")).toBe(testCase.message)
              }
              if (testCase.line) {
                expect(_.get(warning, "line")).toBe(testCase.line)
              }
              if (testCase.column) {
                expect(_.get(warning, "column")).toBe(testCase.column)
              }
            })
          })
        })
      })
    }
  })
}

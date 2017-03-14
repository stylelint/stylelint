"use strict"

const _ = require("lodash")
const basicChecks = require("./lib/testUtils/basicChecks")
const stylelint = require("./lib/standalone")

global.testRule = (rule, schema) => {
  expect.extend({
    toHaveMessage(testCase) {
      if (
        testCase.message === undefined
      ) {
        return {
          message: () => (
            "Expected \"reject\" test case to have a \"message\" property"
          ),
          pass: false,
        }
      }

      return {
        pass: true,
      }
    },
  })

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

              expect(testCase).toHaveMessage()

              if (testCase.message !== undefined) {
                expect(_.get(warning, "text")).toBe(testCase.message)
              }
              if (testCase.line !== undefined) {
                expect(_.get(warning, "line")).toBe(testCase.line)
              }
              if (testCase.column !== undefined) {
                expect(_.get(warning, "column")).toBe(testCase.column)
              }
            })
          })
        })
      })
    }
  })
}

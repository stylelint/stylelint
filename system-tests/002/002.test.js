/* @flow */
"use strict"
const systemTestUtils = require("../systemTestUtils")
const stylelint = require("../../lib")

it("002", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("002")],
    configFile: systemTestUtils.caseConfig("002"),
  }).then(({ results }) => {
    expect(systemTestUtils.prepResults(results)).toMatchSnapshot()
  })
})

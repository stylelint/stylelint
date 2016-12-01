/* @flow */
"use strict"

const systemTestUtils = require("../systemTestUtils")
const stylelint = require("../../lib")

it("003", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("003")],
    configFile: systemTestUtils.caseConfig("003"),
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
  })
})

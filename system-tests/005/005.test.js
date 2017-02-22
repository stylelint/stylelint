/* @flow */
"use strict"

const systemTestUtils = require("../systemTestUtils")
const stylelint = require("../../lib")

it("005", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("005")],
    configFile: systemTestUtils.caseConfig("005"),
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
  })
})

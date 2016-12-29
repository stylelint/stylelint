/* @flow */
"use strict"

const systemTestUtils = require("../../systemTestUtils")
const stylelint = require("../../../lib")

it("deprecations/001", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("deprecations/001")],
    configFile: systemTestUtils.caseConfig("deprecations/001"),
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
  })
})

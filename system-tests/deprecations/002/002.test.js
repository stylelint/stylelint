/* @flow */
"use strict"

const systemTestUtils = require("../../systemTestUtils")
const stylelint = require("../../../lib")

it("deprecations/002", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("deprecations/002")],
    configFile: systemTestUtils.caseConfig("deprecations/002"),
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
  })
})

/* @flow */
"use strict"

const systemTestUtils = require("../../systemTestUtils")
const stylelint = require("../../../lib")

it("deprecations/003", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("deprecations/003")],
    configFile: systemTestUtils.caseConfig("deprecations/003"),
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
  })
})

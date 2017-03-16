/* @flow */
"use strict"

const systemTestUtils = require("../systemTestUtils")
const stylelint = require("../../lib")

it("fixing", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("fixing")],
    configFile: systemTestUtils.caseConfig("fixing"),
    fix: true,
  }).then((output) => {
    expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot()
    expect(output.results[0]._postcssResult.root.toResult().css).toMatchSnapshot()
  })
})

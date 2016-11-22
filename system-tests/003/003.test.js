/* @flow */
import * as systemTestUtils from "../systemTestUtils"
import stylelint from "../../src"

it("003", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("003")],
    configFile: systemTestUtils.caseConfig("003"),
  }).then(({ results }) => {
    expect(systemTestUtils.prepResults(results)).toMatchSnapshot()
  })
})

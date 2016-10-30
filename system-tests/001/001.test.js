/* @flow */
import * as systemTestUtils from "../systemTestUtils"
import stylelint from "../../src"

it("001", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("001")],
    configFile: systemTestUtils.caseConfig("001"),
  }).then(({ results }) => {
    expect(systemTestUtils.prepResults(results)).toMatchSnapshot()
  })
})

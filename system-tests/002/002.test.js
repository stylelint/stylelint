/* @flow */
import * as systemTestUtils from "../systemTestUtils"
import stylelint from "../../src"

it("002", () => {
  return stylelint.lint({
    files: [systemTestUtils.caseStylesheetGlob("002")],
    configFile: systemTestUtils.caseConfig("002"),
  }).then(({ results }) => {
    expect(systemTestUtils.prepResults(results)).toMatchSnapshot()
  })
})

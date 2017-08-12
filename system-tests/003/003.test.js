/* @flow */
"use strict";

const stylelint = require("../../lib");
const systemTestUtils = require("../systemTestUtils");

it("003", () => {
  return stylelint
    .lint({
      files: [systemTestUtils.caseStylesheetGlob("003")],
      configFile: systemTestUtils.caseConfig("003")
    })
    .then(output => {
      expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot();
    });
});

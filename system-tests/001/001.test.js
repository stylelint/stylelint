/* @flow */
"use strict";

const stylelint = require("../../lib");
const systemTestUtils = require("../systemTestUtils");

it("001", () => {
  return stylelint
    .lint({
      files: [systemTestUtils.caseStylesheetGlob("001")],
      configFile: systemTestUtils.caseConfig("001")
    })
    .then(output => {
      expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot();
    });
}, 10000);

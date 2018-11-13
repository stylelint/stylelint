/* @flow */
"use strict";

const stylelint = require("../../lib");
const systemTestUtils = require("../systemTestUtils");

it("005", () => {
  return stylelint
    .lint({
      files: [systemTestUtils.caseStylesheetGlob("005")],
      configFile: systemTestUtils.caseConfig("005")
    })
    .then(output => {
      expect(systemTestUtils.prepResults(output.results)).toMatchSnapshot();
    });
}, 10000);

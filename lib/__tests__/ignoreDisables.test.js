"use strict";

const postcssPlugin = require("../postcssPlugin");
const standalone = require("../standalone");
const stripIndent = require("common-tags").stripIndent;

const config = {
  rules: { "block-no-empty": true }
};

const css = stripIndent`
  /* stylelint-disable */
  a {}
  /* stylelint-enable */
  a {
    b {} /* stylelint-disable-line block-no-empty */
  }`;

describe("ignoreDisables with postcssPlugins", () => {
  let result;

  beforeEach(() => {
    return postcssPlugin
      .process(
        css,
        { from: undefined },
        {
          config,
          ignoreDisables: true
        }
      )
      .then(data => (result = data));
  });

  it("expected number of warnings", () => {
    expect(result.warnings().length).toBe(2);
  });

  it("expected rule", () => {
    expect(result.warnings()[0].text.indexOf("block-no-empty")).not.toBe(1);
  });

  it("expected rule", () => {
    expect(result.warnings()[1].text.indexOf("block-no-empty")).not.toBe(1);
  });
});

describe("ignoreDisables with standalone", () => {
  let results;

  beforeEach(() => {
    return standalone({
      config,
      code: css,
      ignoreDisables: true
    }).then(data => (results = data.results));
  });

  it("expected number of warnings", () => {
    expect(results[0].warnings.length).toBe(2);
  });

  it("expected rule", () => {
    expect(results[0].warnings[0].text.indexOf("block-no-empty")).not.toBe(1);
  });

  it("expected rule", () => {
    expect(results[0].warnings[1].text.indexOf("block-no-empty")).not.toBe(1);
  });
});

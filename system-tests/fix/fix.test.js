"use strict";

const _ = require("lodash");
const cpFile = require("cp-file");
const del = require("del");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pify = require("pify");
const stylelint = require("../../lib");
const systemTestUtils = require("../systemTestUtils");

describe("fix", () => {
  let tmpDir;
  let stylesheetPath;

  beforeEach(() => {
    tmpDir = os.tmpdir();
    stylesheetPath = path.join(tmpDir, `stylesheet-${_.uniqueId()}.css`);
    return cpFile(path.join(__dirname, "stylesheet.css"), stylesheetPath);
  });

  afterEach(() => {
    return del(stylesheetPath, { force: true });
  });

  it("expected stylelint results", () => {
    return stylelint
      .lint({
        files: [stylesheetPath],
        configFile: systemTestUtils.caseConfig("fix"),
        fix: true
      })
      .then(output => {
        // Remove the path to tmpDir
        const cleanedResults = output.results.map(r =>
          Object.assign({}, r, { source: "stylesheet.css" })
        );
        expect(systemTestUtils.prepResults(cleanedResults)).toMatchSnapshot();
      });
  });

  it("expected fixes to PostCSS Result", () => {
    return stylelint
      .lint({
        files: [stylesheetPath],
        configFile: systemTestUtils.caseConfig("fix"),
        fix: true
      })
      .then(output => {
        const result = output.results[0]._postcssResult;
        expect(result.root.toString(result.opts.syntax)).toMatchSnapshot();
      });
  });

  it("overwrites the original file", () => {
    return stylelint
      .lint({
        files: [stylesheetPath],
        configFile: systemTestUtils.caseConfig("fix"),
        fix: true
      })
      .then(output => {
        const result = output.results[0]._postcssResult;
        return pify(fs.readFile)(stylesheetPath, "utf8").then(fileContent => {
          expect(fileContent).toBe(result.root.toString(result.opts.syntax));
        });
      });
  });

  it("doesn't write to ignored file", () => {
    return stylelint
      .lint({
        files: [stylesheetPath],
        config: {
          ignoreFiles: stylesheetPath,
          rules: {
            "at-rule-name-case": "lower",
            "comment-empty-line-before": "always",
            "comment-no-empty": true
          }
        },
        fix: true
      })
      .then(() => {
        return pify(fs.readFile)(stylesheetPath, "utf8").then(newFile => {
          return pify(fs.readFile)(
            path.join(__dirname, "stylesheet.css"),
            "utf8"
          ).then(oldFile => {
            expect(newFile).toBe(oldFile);
          });
        });
      });
  });
});

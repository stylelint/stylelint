"use strict";

const path = require("path");
const standalone = require("../../standalone");

describe("standalone with .stylelintignore file ignoring one file", () => {
  let actualCwd;
  let results;
  const fixturesPath = path.join(__dirname, "../fixtures");

  beforeEach(() => {
    actualCwd = process.cwd();
    process.chdir(__dirname, "../fixtures");
  });

  afterEach(() => {
    process.chdir(actualCwd);
  });

  beforeEach(() => {
    return standalone({
      files: [
        `${fixturesPath}/empty-block.css`,
        `${fixturesPath}/invalid-hex.css`
      ],
      config: {
        extends: [
          `${fixturesPath}/config-block-no-empty`,
          `${fixturesPath}/config-color-no-invalid-hex`
        ]
      }
    }).then(data => (results = data.results));
  });

  it("one file read", () => {
    expect(results.length).toBe(1);
  });

  it("empty-block.css not read", () => {
    expect(/empty-block\.css/.test(results[0].source)).toBe(false);
  });

  it("color-no-invalid-hex.css read", () => {
    expect(/invalid-hex\.css/.test(results[0].source)).toBe(true);
  });

  it("color-no-invalid-hex.css linted", () => {
    expect(results[0].warnings.length).toBe(1);
  });
});

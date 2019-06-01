"use strict";

const _ = require("lodash");
const del = require("del");
const fs = require("fs");
const os = require("os");
const path = require("path");
const pify = require("pify");
const spawn = require("child_process").spawn;
const systemTestUtils = require("../systemTestUtils");

describe("outputFile", () => {
  let tmpDir;
  let directionPath;
  let cliPath;
  let localPath;

  beforeEach(() => {
    localPath = path.resolve(__dirname);
    tmpDir = os.tmpdir();
    cliPath = path.join(localPath, "../../bin/stylelint.js");
    directionPath = path.join(tmpDir, `direction-${_.uniqueId()}.txt`);
  });

  afterEach(() => {
    del(directionPath, { force: true });
  });

  it("writes the result file ", done => {
    const childProcess = spawn(
      "node",
      [
        cliPath,
        `${localPath}/*.css`,
        "--config=config.json",
        `--output-file=${directionPath}`
      ],
      {
        cwd: localPath
      }
    );

    let stdout = "";

    childProcess.stdout.on("data", data => (stdout += data));

    childProcess.on("close", function() {
      return pify(fs.readFile)(directionPath, "utf-8").then(content => {
        expect(content).toEqual(systemTestUtils.stripColors(stdout));
        expect(content).toMatchSnapshot();
        done();
      });
    });
  });
});

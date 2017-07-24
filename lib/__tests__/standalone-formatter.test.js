"use strict";

const configBlockNoEmpty = require("./fixtures/config-block-no-empty");
const standalone = require("../standalone");
const stringFormatter = require("../formatters/stringFormatter");
const stripAnsi = require("strip-ansi");

it("standalone with input css and alternate formatter specified by keyword", () => {
  return standalone({
    code: "a {}",
    config: configBlockNoEmpty,
    formatter: "string"
  }).then(linted => {
    const output = linted.output;

    const strippedOutput = stripAnsi(output);
    expect(typeof output).toBe("string");
    expect(strippedOutput.indexOf("1:3")).not.toBe(-1);
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1);
  });
});

it("standalone with input css and alternate formatter function", () => {
  return standalone({
    code: "a {}",
    config: configBlockNoEmpty,
    formatter: stringFormatter
  }).then(linted => {
    const output = linted.output;

    const strippedOutput = stripAnsi(output);
    expect(typeof output).toBe("string");
    expect(strippedOutput.indexOf("1:3")).not.toBe(-1);
    expect(strippedOutput.indexOf("block-no-empty")).not.toBe(-1);
  });
});

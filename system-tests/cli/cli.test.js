/* eslint no-console: off */
"use strict";
const cli = require("../../lib/cli");
const pkg = require("../../package.json");

describe("CLI", () => {
  let processRestore;
  let logRestore;

  beforeAll(() => {
    processRestore = Object.assign({}, process);
    logRestore = Object.assign({}, console);
    process.exit = exitCode => (process.exitCode = exitCode);
  });

  afterAll(() => {
    Object.assign(process, processRestore);
    Object.assign(console, logRestore);
  });

  beforeEach(function() {
    process.exitCode = undefined;
    console.log = jest.fn();
    if (parseInt(process.versions.node) < 7) {
      // https://github.com/sindresorhus/get-stdin/issues/13
      process.nextTick(() => {
        process.stdin.end();
      });
    }
  });

  it(
    "basic",
    () => {
      return cli([]).then(() => {
        expect(process.exitCode).toBe(2);
        expect(console.log.mock.calls).toHaveLength(1);
        const lastCallArgs = console.log.mock.calls.pop();
        expect(lastCallArgs).toHaveLength(1);
        expect(lastCallArgs.pop()).toMatch(
          "Usage: stylelint [input] [options]"
        );
      });
    },
    20000
  );

  it(
    "--help",
    () => {
      return Promise.resolve(cli(["--help"])).then(() => {
        expect(process.exitCode).toBe(0);
        expect(console.log.mock.calls).toHaveLength(1);
        const lastCallArgs = console.log.mock.calls.pop();
        expect(lastCallArgs).toHaveLength(1);
        expect(lastCallArgs.pop()).toMatch(
          "Usage: stylelint [input] [options]"
        );
      });
    },
    20000
  );

  it(
    "--version",
    () => {
      return Promise.resolve(cli(["--version"])).then(() => {
        expect(process.exitCode).toBe(undefined);
        expect(console.log.mock.calls).toHaveLength(1);
        const lastCallArgs = console.log.mock.calls.pop();
        expect(lastCallArgs).toHaveLength(1);
        expect(lastCallArgs.pop()).toMatch(pkg.version);
      });
    },
    20000
  );
});

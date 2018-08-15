/* eslint no-console: off */
"use strict";
const cli = require("../../lib/cli");
const path = require("path");
const pkg = require("../../package.json");

jest.mock("get-stdin");

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
    process.stdout.write = jest.fn();
    if (parseInt(process.versions.node) < 7) {
      // https://github.com/sindresorhus/get-stdin/issues/13
      process.nextTick(() => {
        process.stdin.end();
      });
    }
  });

  it("basic", () => {
    return cli([]).then(() => {
      expect(process.exitCode).toBe(2);
      expect(console.log.mock.calls).toHaveLength(1);
      const lastCallArgs = console.log.mock.calls.pop();
      expect(lastCallArgs).toHaveLength(1);
      expect(lastCallArgs.pop()).toMatch("Usage: stylelint [input] [options]");
    });
  });

  it("--help", () => {
    return Promise.resolve(cli(["--help"])).then(() => {
      expect(process.exitCode).toBe(0);
      expect(console.log.mock.calls).toHaveLength(1);
      const lastCallArgs = console.log.mock.calls.pop();
      expect(lastCallArgs).toHaveLength(1);
      expect(lastCallArgs.pop()).toMatch("Usage: stylelint [input] [options]");
    });
  });

  it("--version", () => {
    return Promise.resolve(cli(["--version"])).then(() => {
      expect(process.exitCode).toBe(undefined);
      expect(console.log.mock.calls).toHaveLength(1);
      const lastCallArgs = console.log.mock.calls.pop();
      expect(lastCallArgs).toHaveLength(1);
      expect(lastCallArgs.pop()).toMatch(pkg.version);
    });
  });

  it("--print-config", () => {
    return Promise.resolve(
      cli([
        "--print-config",
        "--config",
        path.join(__dirname, "config.json"),
        path.join(__dirname, "stylesheet.css")
      ])
    ).then(() => {
      expect(process.exitCode).toBe(undefined);
      expect(process.stdout.write).toHaveBeenCalledTimes(1);
      expect(process.stdout.write).toHaveBeenLastCalledWith(
        JSON.stringify(
          {
            rules: {
              "block-no-empty": [true]
            }
          },
          null,
          "  "
        )
      );
    });
  });
});

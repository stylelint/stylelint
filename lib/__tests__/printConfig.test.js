"use strict";

const path = require("path");
const pluginWarnAboutFoo = require("./fixtures/plugin-warn-about-foo");
const printConfig = require("../printConfig");

it("printConfig uses getConfigForFile to retrieve the config", () => {
  const filepath = path.join(
    __dirname,
    "fixtures/getConfigForFile/a/b/foo.css"
  );

  return printConfig({
    files: [filepath]
  }).then(result => {
    expect(result).toEqual({
      plugins: [path.join(__dirname, "/fixtures/plugin-warn-about-foo.js")],
      rules: {
        "block-no-empty": [true],
        "plugin/warn-about-foo": ["always"]
      },
      pluginFunctions: {
        "plugin/warn-about-foo": pluginWarnAboutFoo.rule
      }
    });
  });
});

it("printConfig with input css should throw", () => {
  expect(
    printConfig({
      code: "a {}"
    })
  ).rejects.toThrow(
    "The --print-config option must be used with exactly one file path."
  );
});

it("printConfig with no path should throw", () => {
  expect(
    printConfig({
      files: []
    })
  ).rejects.toThrow(
    "The --print-config option must be used with exactly one file path."
  );
});

it("printConfig with multiple paths should throw", () => {
  expect(
    printConfig({
      files: ["./first-path.css", "./second-path.css"]
    })
  ).rejects.toThrow(
    "The --print-config option must be used with exactly one file path."
  );
});

it("printConfig with globs should throw", () => {
  expect(
    printConfig({
      files: ["./*.css"]
    })
  ).rejects.toThrow("The --print-config option does not support globs.");
});

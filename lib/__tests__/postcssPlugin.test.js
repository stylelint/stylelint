"use strict";

const configurationError = require("../utils/configurationError");
const path = require("path");
const postcssPlugin = require("../postcssPlugin");

it("`config` option is `null`", () => {
  return postcssPlugin
    .process("a {}", { from: undefined })
    .then(() => {
      throw new Error("should not have succeeded");
    })
    .catch(err => {
      expect(err.message.indexOf("No configuration provided")).not.toBe(-1);
    });
});

it("`configFile` option with absolute path", () => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-block-no-empty.json")
  };
  return postcssPlugin
    .process("a {}", { from: undefined }, config)
    .then(postcssResult => {
      const warnings = postcssResult.warnings();
      expect(warnings.length).toBe(1);
      expect(warnings[0].text.indexOf("block-no-empty")).not.toBe(-1);
    });
});

it("`configFile` with bad path", () => {
  return postcssPlugin
    .process("a {}", { from: undefined }, { configFile: "./herby.json" })
    .then(() => {
      throw new Error("should not have succeeded");
    })
    .catch(err => {
      expect(err.code).toBe("ENOENT");
    });
});

it("`configFile` option without rules", () => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-without-rules.json")
  };
  return postcssPlugin
    .process("a {}", { from: undefined }, config)
    .then(() => {
      throw new Error("should not have succeeded");
    })
    .catch(err => {
      expect(err).toEqual(
        configurationError(
          'No rules found within configuration. Have you provided a "rules" property?'
        )
      );
    });
});

it("`configFile` option with undefined rule", () => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-with-undefined-rule.json")
  };
  const ruleName = "unknown-rule";
  return postcssPlugin
    .process("a {}", { from: undefined }, config)
    .then(() => {
      throw new Error("should not have succeeded");
    })
    .catch(err => {
      expect(err).toEqual(configurationError(`Undefined rule ${ruleName}`));
    });
});

it("`ignoreFiles` options is not empty and file ignored", () => {
  const config = {
    rules: {
      "block-no-empty": true
    },
    ignoreFiles: "**/foo.css",
    from: "foo.css"
  };
  return postcssPlugin
    .process("a {}", { from: undefined }, config)
    .then(postcssResult => {
      expect(postcssResult.stylelint.ignored).toBeTruthy();
    });
});

it("`ignoreFiles` options is not empty and file not ignored", () => {
  const config = {
    rules: {
      "block-no-empty": true
    },
    ignoreFiles: "**/bar.css",
    from: "foo.css"
  };
  return postcssPlugin
    .process("a {}", { from: undefined }, config)
    .then(postcssResult => {
      expect(postcssResult.stylelint.ignored).toBeFalsy();
    });
});

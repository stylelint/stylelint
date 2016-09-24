import { configurationError } from "../utils"
import path from "path"
import postcssPlugin from "../postcssPlugin"
import test from "tape"

test("`config` option is `null`", t => {
  postcssPlugin.process("a {}")
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch((err) => {
      t.ok(err.message.indexOf("No configuration provided") !== -1)
      t.end()
    })
})

test("`configFile` option with absolute path", t => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-block-no-empty.json"),
  }
  postcssPlugin.process("a {}", config)
    .then((postcssResult) => {
      const warnings = postcssResult.warnings()
      t.equal(warnings.length, 1)
      t.ok(warnings[0].text.indexOf("block-no-empty") !== -1)
      t.end()
    })
    .catch(t.end)
})

test("`configFile` with bad path", t => {
  postcssPlugin.process("a {}", { configFile: "./herby.json" })
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch((err) => {
      t.equal(err.code, "ENOENT")
      t.end()
    })
})

test("`configFile` option without rules", t => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-without-rules.json"),
  }
  postcssPlugin.process("a {}", config)
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch((err) => {
      t.deepEqual(err, configurationError("No rules found within configuration. Have you provided a \"rules\" property?"))
      t.end()
    })
})

test("`configFile` option with undefined rule", t => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-with-undefined-rule.json"),
  }
  const ruleName = "unknown-rule"
  postcssPlugin.process("a {}", config)
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch((err) => {
      t.deepEqual(err, configurationError(`Undefined rule "${ruleName}"`))
      t.end()
    })
})

test("`ignoreFiles` options is not empty and file ignored", t => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
    ignoreFiles: "**/foo.css",
    from: "foo.css",
  }
  postcssPlugin.process("a {}", config)
    .then((postcssResult) => {
      t.ok(postcssResult.stylelint.ignored)
      t.end()
    })
    .catch(t.end)
})

test("`ignoreFiles` options is not empty and file not ignored", t => {
  const config = {
    rules: {
      "block-no-empty": true,
    },
    ignoreFiles: "**/bar.css",
    from: "foo.css",
  }
  postcssPlugin.process("a {}", config)
    .then((postcssResult) => {
      t.notOk(postcssResult.stylelint.ignored)
      t.end()
    })
    .catch(t.end)
})

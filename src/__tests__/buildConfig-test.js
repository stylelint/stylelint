import buildConfig from "../buildConfig"
import path from "path"
import test from "tape"

test("buildConfig with config as argument object", t => {
  let planned = 0

  buildConfig({ rules: { foo: true } }).then(({ config, configDir }) => {
    t.deepEqual(config, {
      rules: {
        foo: true,
      },
    }, "returns config")
    t.equal(configDir, process.cwd(), "uses process.cwd as configDir")
  }).catch(logError)
  planned += 2

  t.plan(planned)
})

test("buildConfig with config as property of options object", t => {
  let planned = 0

  const optionsA = {
    config: {
      rules: { foo: true },
    },
  }
  buildConfig(optionsA).then(({ config, configDir }) => {
    t.deepEqual(config, {
      rules: {
        foo: true,
      },
    }, "returns config")
    t.equal(configDir, process.cwd(), "uses process.cwd as configDir")
  }).catch(logError)
  planned += 2

  const optionsB = {
    configBasedir: "/baz/bar",
    config: {
      rules: { foo: true },
    },
  }
  buildConfig(optionsB).then(({ configDir }) => {
    t.equal(configDir, "/baz/bar", "understands options.configBasedir")
  }).catch(logError)
  planned += 1

  const optionsC = {
    configOverrides: { rules: { foo: "blather" } },
    config: {
      rules: { foo: true },
    },
  }
  buildConfig(optionsC).then(({ config }) => {
    t.equal(config.rules.foo, "blather", "understands options.configOverrides")
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("buildConfig with config as property of options object", t => {
  let planned = 0

  const arg = {
    config: {
      rules: { foo: true },
    },
  }
  buildConfig(arg).then(({ config, configDir }) => {
    t.deepEqual(config, {
      rules: {
        foo: true,
      },
    }, "returns config")
    t.deepEqual(configDir, process.cwd(), "uses process.cwd as configDir")
  }).catch(logError)
  planned += 2

  t.plan(planned)
})

test(
  "buildConfig finds config (via options.configFile), resolves plugin names into absolute paths, " +
  "interpreting relative paths relative to the config file", t => {
  let planned = 0

  const optionsA = {
    configFile: path.join(__dirname, "./fixtures/config-relative-plugin.json"),
  }
  buildConfig(optionsA).then(({ config, configDir }) => {
    t.deepEqual(config, {
      plugins: [
        path.join(__dirname, "./fixtures/plugin-warn-about-foo.js"),
      ],
      rules: {
        "plugin/warn-about-foo": "always",
      },
    }, "returns config")
    t.equal(configDir, path.join(__dirname, "./fixtures"
    ), "uses process.cwd as configDir")
  }).catch(logError)
  planned += 2

  t.plan(planned)
})

test("buildConfig extends", t => {
  let planned = 0

  const optionsA = {
    configFile: path.join(__dirname, "./fixtures/config-extending-with-plugin.json"),
  }
  buildConfig(optionsA).then(({ config }) => {
    t.deepEqual(config, {
      plugins: [
        path.join(__dirname, "./fixtures/plugin-warn-about-foo.js"),
      ],
      rules: {
        "plugin/warn-about-foo": "always",
        "block-no-empty": true,
        "color-no-invalid-hex": true,
      },
    }, "extends deeply, merging rules and plugins")
  })
  planned += 1

  t.plan(planned)
})

test("buildConfig throws as needed", t => {
  let planned = 0

  buildConfig({ configBasedir: __dirname }).catch(err => {
    t.equal(err.message, "No configuration found", "when no configuration is specified or found")
  })
  planned += 1

  buildConfig({
    plugins: ["./nonexistent.js"],
    rules: { foo: true },
  }).catch(err => {
    t.equal(err.message, "Could not find \"./nonexistent.js\". Do you need a `configBasedir`?",
      "when a plugin is not found")
  })
  planned += 1

  buildConfig({
    extends: ["./nonexistent.js"],
    rules: { foo: true },
  }).catch(err => {
    t.equal(err.message, "Could not find \"./nonexistent.js\". Do you need a `configBasedir`?",
      "when an extend is not found")
  })
  planned += 1

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line

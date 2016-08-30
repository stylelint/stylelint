import buildConfig from "../buildConfig"
import fs from "fs"
import path from "path"
import sinon from "sinon"
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

test(
  "buildConfig finds config (via options.configFile), resolves plugin names into absolute paths, " +
  "interpreting relative paths relative to configBasedir", t => {
  let planned = 0

  const optionsA = {
    configFile: path.join(__dirname, "./fixtures/config-relative-plugin-nested.json"),
    configBasedir: path.join(__dirname, "./fixtures/nested-plugin"),
  }
  buildConfig(optionsA).then(({ config, configDir }) => {
    t.deepEqual(config, {
      plugins: [
        path.join(__dirname, "./fixtures/nested-plugin/plugin-nested-warn-about-foo.js"),
      ],
      rules: {
        "plugin/warn-about-foo": "always",
      },
    }, "returns config")
    t.equal(configDir, path.join(__dirname, "./fixtures/nested-plugin"
    ), "uses configBasedir as configDir")
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
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("buildConfig config with plugins extends with plugins", t => {
  let planned = 0

  const optionsA = {
    configFile: path.join(__dirname, "./fixtures/config-plugin-extending-with-plugin.json"),
  }
  buildConfig(optionsA).then(({ config }) => {
    t.deepEqual(config, {
      plugins: [
        path.join(__dirname, "./fixtures/plugin-warn-about-bar.js"),
        path.join(__dirname, "./fixtures/plugin-warn-about-foo.js"),
      ],
      rules: {
        "plugin/warn-about-foo": "always",
        "plugin/warn-about-bar": "always",
      },
    }, "extends, and merges plugins")
  }).catch(logError)
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

test("buildConfig extends rules by replacing the prior rule config completely, not merging", t => {
  buildConfig({
    extends: [path.join(__dirname, "./fixtures/config-at-rule-empty-line-before")],
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).then(({ config }) => {
    t.deepEqual(config, {
      rules: {
        "at-rule-empty-line-before": [ "always", {
          expect: ["blockless-group"],
        } ],
      },
    })
    t.end()
  }).catch(logError)
})

test("buildConfig correctly handles `ignoreFiles`", t => {
  const cwd = process.cwd()
  process.chdir(__dirname)

  buildConfig({
    ignoreFiles: [
      "/ignore.css",
      "ignore-too.css",
    ],
    rules: {},
  }).then(({ config }) => {
    t.deepEqual(config, {
      ignoreFiles: [
        "/ignore.css",
        path.join(__dirname, "ignore-too.css"),
      ],
      rules: {},
    })
    process.chdir(cwd)
    t.end()
  }).catch(logError)
})

test("buildConfig have `ignorePatterns` if `ignorePath` found", t => {
  buildConfig({
    ignorePath: path.join(__dirname, "./fixtures/ignore.txt"),
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).then(({ config }) => {
    t.deepEqual(config, {
      ignorePath: path.join(__dirname, "./fixtures/ignore.txt"),
      ignorePatterns: "# Ignore file patterns are always relative to process.cwd()\n\nsrc/__tests__/fixtures/empty-block.css\n",
      rules: {
        "at-rule-empty-line-before": [ "always", {
          expect: ["blockless-group"],
        } ],
      },
    })
    t.end()
  })
    .catch(logError)
})

test("buildConfig have not `ignorePatterns` if `ignorePath` not found", t => {
  buildConfig({
    ignorePath: "/nonexistent.js",
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).then(({ config }) => {
    t.deepEqual(config, {
      ignorePath: "/nonexistent.js",
      rules: {
        "at-rule-empty-line-before": [ "always", {
          expect: ["blockless-group"],
        } ],
      },
    })
    t.end()
  })
    .catch(logError)
})

test("buildConfig throw error if we have file system problem with `ignorePath`", t => {
  let planned = 0

  const fsStub = sinon.stub(fs, "readFile")
  fsStub.yields(new Error("Some file system error"))

  buildConfig({
    ignorePath: "/nonexistent-ignore.js",
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).catch(err => {
    t.equal(err.message, "Some file system error")
    fsStub.restore()
  })
  planned += 1

  t.plan(planned)
})

test("buildConfig loads processors", t => {
  buildConfig({
    configBasedir: __dirname,
    processors: "./fixtures/processor-fenced-blocks.js",
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).then(({ config }) => {
    t.deepEqual(config, {
      configBasedir: __dirname,
      processors: path.join(__dirname, "./fixtures/processor-fenced-blocks.js"),
      rules: {
        "at-rule-empty-line-before": [ "always", {
          expect: ["blockless-group"],
        } ],
      },
    })
    t.end()
  })
    .catch(logError)
})

test("buildConfig throw error if processor not found", t => {
  let planned = 0

  buildConfig({
    processors: ["stylelint-nonexistent-processor"],
    rules: {
      "at-rule-empty-line-before": [ "always", {
        expect: ["blockless-group"],
      } ],
    },
  }).catch(err => {
    t.equal(err.message, "Could not find \"stylelint-nonexistent-processor\". Do you need a `configBasedir`?",
      "when a processor is not found")
  })
  planned += 1

  t.plan(planned)
})

function logError(err) { console.log(err.stack) } // eslint-disable-line

import path from "path"
import postcss from "postcss"
import stylelint from ".."
import test from "tape"

const cssWithFoo = (
".foo {}"
)

const cssWithoutFoo = (
".bar {}"
)

const cssWithFooAndBar = (
".foo {}\n.bar {}"
)

const configRelative = {
  plugins: [
    "./fixtures/plugin-warn-about-foo",
  ],
  rules: {
    "plugin/warn-about-foo": "always",
    "block-no-empty": true,
  },
}

const configAbsolute = {
  plugins: [
    path.join(__dirname, "./fixtures/plugin-warn-about-foo"),
  ],
  rules: {
    "plugin/warn-about-foo": "always",
    "block-no-empty": true,
  },
}

const configExtendRelative = {
  extends: [
    "./fixtures/config-relative-plugin",
  ],
}

const configRelativeAndExtendRelative = {
  extends: [
    "./fixtures/config-relative-plugin",
  ],
  plugins: [
    "./fixtures/plugin-warn-about-bar",
  ],
  rules: {
    "plugin/warn-about-bar": "always",
  },
}

const processorRelative = postcss().use(stylelint({ config: configRelative, configBasedir: __dirname }))
const processorAbsolute = postcss().use(stylelint({ config: configAbsolute }))
const processorExtendRelative = postcss().use(stylelint({ config: configExtendRelative, configBasedir: __dirname }))
const processorRelativeAndExtendRelative = postcss().use(stylelint({ config: configRelativeAndExtendRelative, configBasedir: __dirname }))

test("plugin runs", t => {
  t.test((st) => {
    processorRelative.process(cssWithFoo)
      .then(result => {
        st.equal(result.warnings().length, 2)
        st.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
        st.ok(result.warnings()[0].node)
        st.end()
      })
      .catch(st.end)
  })

  t.test((st) => {
    processorRelative.process(cssWithoutFoo)
      .then(result => {
        st.equal(result.warnings().length, 1)
        st.equal(result.warnings()[0].text, "Unexpected empty block (block-no-empty)")
        st.end()
      })
      .catch(st.end)
  })

  t.end()
})

test("plugin with absolute path and no configBasedir", t => {
  processorAbsolute.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
      t.end()
    })
    .catch(t.end)
})

test("config extending another config that invokes a plugin with a relative path", t => {
  processorExtendRelative.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 1)
      t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
      t.end()
    })
    .catch(t.end)
})

test("config with its own plugins extending another config that invokes a plugin with a relative path", t => {
  processorRelativeAndExtendRelative.process(cssWithFooAndBar)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .bar (plugin/warn-about-bar)")
      t.equal(result.warnings()[1].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
      t.end()
    })
    .catch(t.end)
})

test("plugin using exposed rules via stylelint.rules", t => {
  const cssWithDirectiveLower = "/** @@check-color-hex-case */ a { color: #eee; }"
  const cssWithDirectiveUpper = "/** @@check-color-hex-case */ a { color: #EEE; }"
  const cssWithoutDirectiveLower = "a { color: #eee; }"
  const cssWithoutDirectiveUpper = "a { color: #EEE; }"
  const config = expectation => ({
    config: {
      plugins: [path.join(__dirname, "fixtures/plugin-conditionally-check-color-hex-case")],
      rules: {
        "plugin/conditionally-check-color-hex-case": expectation,
      },
    },
  })

  t.test((st) => {
    postcss().use(stylelint(config("upper"))).process(cssWithDirectiveLower).then(result => {
      st.equal(result.warnings().length, 1)
      st.equal(result.warnings()[0].text, "Expected \"#eee\" to be \"#EEE\" (color-hex-case)")
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("upper"))).process(cssWithDirectiveLower).then(result => {
      st.equal(result.warnings().length, 1)
      st.equal(result.warnings()[0].text, "Expected \"#eee\" to be \"#EEE\" (color-hex-case)")
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("upper"))).process(cssWithDirectiveUpper).then(result => {
      st.equal(result.warnings().length, 0)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("lower"))).process(cssWithDirectiveUpper).then(result => {
      st.equal(result.warnings().length, 1)
      st.equal(result.warnings()[0].text, "Expected \"#EEE\" to be \"#eee\" (color-hex-case)")
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("lower"))).process(cssWithDirectiveLower).then(result => {
      st.equal(result.warnings().length, 0)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("upper"))).process(cssWithoutDirectiveLower).then(result => {
      st.equal(result.warnings().length, 0)
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config("lower"))).process(cssWithoutDirectiveUpper).then(result => {
      st.equal(result.warnings().length, 0)
      st.end()
    }).catch(st.end)
  })

  t.end()
})

test("module providing an array of plugins", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-array")],
    rules: {
      "plugin/conditionally-check-color-hex-case": "upper",
      "plugin/warn-about-foo": "always",
    },
  }

  t.test((st) => {
    postcss().use(stylelint(config)).process("@@check-color-hex-case a { color: #eee; }").then(result => {
      st.equal(result.warnings().length, 1)
      st.equal(result.warnings()[0].text, "Expected \"#eee\" to be \"#EEE\" (color-hex-case)")
      st.end()
    }).catch(st.end)
  })

  t.test((st) => {
    postcss().use(stylelint(config)).process(".foo {}").then(result => {
      st.equal(result.warnings().length, 1)
      st.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      st.end()
    }).catch(st.end)
  })

  t.end()
})

test("slashless plugin causes configuration error", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-slashless-warn-about-foo")],
    rules: {
      "slashless-warn-about-foo": true,
    },
  }

  postcss().use(stylelint(config)).process(".foo {}")
    .then(() => {
      t.fail("should not have succeeded")
      t.end()
    })
    .catch(err => {
      t.equal(err.message.indexOf("stylelint v7+ requires plugin rules to be namspaced"), 0)
      t.end()
    })
})

test("plugin with primary option array", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-primary-array")],
    rules: {
      "plugin/primary-array": [ "foo", "bar" ],
    },
  }
  postcss().use((stylelint(config))).process("a {}").then(result => {
    t.equal(result.warnings().length, 0, "nothing went wrong")
    t.end()
  }).catch(t.end)
})

test("plugin with primary option array within options array", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-primary-array")],
    rules: {
      "plugin/primary-array": [ [ "foo", "bar" ], { something: true } ],
    },
  }
  postcss().use((stylelint(config))).process("a {}").then(result => {
    t.equal(result.warnings().length, 0, "nothing went wrong")
    t.end()
  }).catch(t.end)
})

test("loading a plugin from process.cwd", t => {
  const actualCwd = process.cwd()
  process.chdir(__dirname)

  const config = {
    plugins: ["./fixtures/plugin-warn-about-foo"],
    rules: {
      "plugin/warn-about-foo": "always",
    },
  }
  postcss().use((stylelint(config))).process(".foo {}").then(result => {
    t.equal(result.warnings().length, 1, "error is caught")
    t.equal(result.warnings()[0].rule, "plugin/warn-about-foo", "error is correct")
    process.chdir(actualCwd)
    t.end()
  }).catch((err) => {
    process.chdir(actualCwd)
    t.end(err)
  })
})

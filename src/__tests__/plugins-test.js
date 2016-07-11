import postcss from "postcss"
import test from "tape"
import path from "path"
import stylelint from ".."

const cssWithFoo = (
".foo {}"
)

const cssWithoutFoo = (
".bar {}"
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

const processorRelative = postcss().use(stylelint({ config: configRelative, configBasedir: __dirname }))
const processorAbsolute = postcss().use(stylelint({ config: configAbsolute }))
const processorExtendRelative = postcss().use(stylelint({ config: configExtendRelative, configBasedir: __dirname }))

test("plugin runs", t => {
  let planned = 0

  processorRelative.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(logError)
  planned += 3

  processorRelative.process(cssWithoutFoo)
    .then(result => {
      t.equal(result.warnings().length, 1)
      t.equal(result.warnings()[0].text, "Unexpected empty block (block-no-empty)")
    })
    .catch(logError)
  planned += 2

  t.plan(planned)
})

test("plugin with absolute path and no configBasedir", t => {
  let planned = 0

  processorAbsolute.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(logError)
  planned += 3

  t.plan(planned)
})

test("config extending another config that invokes a plugin with a relative path", t => {
  let planned = 0

  processorExtendRelative.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 1)
      t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(logError)
  planned += 3

  t.plan(planned)
})

test("plugin using exposed rules via stylelint.rules", t => {
  let planned = 0

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

  postcss().use(stylelint(config("upper"))).process(cssWithDirectiveLower).then(result => {
    t.equal(result.warnings().length, 1)
    t.equal(result.warnings()[0].text, "Expected \"#eee\" to be \"#EEE\" (color-hex-case)")
  }).catch(logError)
  planned += 2

  postcss().use(stylelint(config("upper"))).process(cssWithDirectiveUpper).then(result => {
    t.equal(result.warnings().length, 0)
  }).catch(logError)
  planned += 1

  postcss().use(stylelint(config("lower"))).process(cssWithDirectiveUpper).then(result => {
    t.equal(result.warnings().length, 1)
    t.equal(result.warnings()[0].text, "Expected \"#EEE\" to be \"#eee\" (color-hex-case)")
  }).catch(logError)
  planned += 2

  postcss().use(stylelint(config("lower"))).process(cssWithDirectiveLower).then(result => {
    t.equal(result.warnings().length, 0)
  }).catch(logError)
  planned += 1

  postcss().use(stylelint(config("upper"))).process(cssWithoutDirectiveLower).then(result => {
    t.equal(result.warnings().length, 0)
  }).catch(logError)
  planned += 1

  postcss().use(stylelint(config("lower"))).process(cssWithoutDirectiveUpper).then(result => {
    t.equal(result.warnings().length, 0)
  }).catch(logError)
  planned += 1

  t.plan(planned)
})

test("module providing an array of plugins", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-array")],
    rules: {
      "plugin/conditionally-check-color-hex-case": "upper",
      "plugin/warn-about-foo": "always",
    },
  }

  let planned = 0

  postcss().use(stylelint(config)).process("@@check-color-hex-case a { color: #eee; }").then(result => {
    t.equal(result.warnings().length, 1)
    t.equal(result.warnings()[0].text, "Expected \"#eee\" to be \"#EEE\" (color-hex-case)")
  }).catch(logError)
  planned += 2

  postcss().use(stylelint(config)).process(".foo {}").then(result => {
    t.equal(result.warnings().length, 1)
    t.equal(result.warnings()[0].text, "found .foo (plugin/warn-about-foo)")
  }).catch(logError)
  planned += 2

  t.plan(planned)
})

test("deprecation warning for slashless plugin rule names", t => {
  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-slashless-warn-about-foo")],
    rules: {
      "slashless-warn-about-foo": "always",
    },
  }

  let planned = 0

  postcss().use(stylelint(config)).process(".foo {}").then(result => {
    t.equal(result.warnings().length, 2)
    t.equal(result.warnings()[0].text, "Plugin rules that aren't namespaced have been deprecated, and in 7.0 they will be disallowed.")
    t.equal(result.warnings()[0].stylelintType, "deprecation")
    t.equal(result.warnings()[1].text, "found .foo (slashless-warn-about-foo)")
  }).catch(logError)
  planned += 4

  t.plan(planned)
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
  }).catch(logError)
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
  }).catch(logError)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}

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

test("config with its own plugins extending another config that invokes a plugin with a relative path", t => {
  let planned = 0

  processorRelativeAndExtendRelative.process(cssWithFooAndBar)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .bar (plugin/warn-about-bar)")
      t.equal(result.warnings()[1].text, "found .foo (plugin/warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(logError)
  planned += 4

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

test("slashless plugin causes configuration error", t => {
  let planned = 0

  const config = {
    plugins: [path.join(__dirname, "fixtures/plugin-slashless-warn-about-foo")],
    rules: {
      "slashless-warn-about-foo": true,
    },
  }

  postcss().use(stylelint(config)).process(".foo {}").then(() => {
    t.ok(false, "should not be here!")
  }).catch(err => {
    t.equal(err.message.indexOf("stylelint v7+ requires plugin rules to be namspaced"), 0)
  })
  planned += 1

  t.plan(planned)
})

function logError(err) {
  console.log(err.stack) // eslint-disable-line no-console
}

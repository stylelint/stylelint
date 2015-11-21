import postcss from "postcss"
import test from "tape"
import path from "path"
import stylelint from ".."

const cssWithFoo = (
`.foo {}`
)

const cssWithoutFoo = (
`.bar {}`
)

const configRelative = {
  plugins: [
    "./fixtures/plugin-warn-about-foo",
  ],
  rules: {
    "warn-about-foo": "always",
    "block-no-empty": true,
  },
}

const configAbsolute = {
  plugins: [
    path.join(__dirname, "./fixtures/plugin-warn-about-foo"),
  ],
  rules: {
    "warn-about-foo": "always",
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
      t.equal(result.warnings()[0].text, "found .foo (warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(err => console.log(err.stack))
  planned += 3

  processorRelative.process(cssWithoutFoo)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "never found .foo (warn-about-foo)")
      t.notOk(result.warnings()[0].node)
    })
    .catch(err => console.log(err.stack))
  planned += 3

  t.plan(planned)
})

test("plugin with absolute path and no configBasedir", t => {
  let planned = 0

  processorAbsolute.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 2)
      t.equal(result.warnings()[0].text, "found .foo (warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(err => console.log(err.stack))
  planned += 3

  t.plan(planned)
})

test("config extending another config that invokes a plugin with a relative path", t => {
  let planned = 0

  processorExtendRelative.process(cssWithFoo)
    .then(result => {
      t.equal(result.warnings().length, 1)
      t.equal(result.warnings()[0].text, "found .foo (warn-about-foo)")
      t.ok(result.warnings()[0].node)
    })
    .catch(err => console.log(err.stack))
  planned += 3

  t.plan(planned)
})

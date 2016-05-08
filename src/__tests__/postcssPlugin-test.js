import test from "tape"
import path from "path"
import postcssPlugin from "../postcssPlugin"

test("`configFile` option with absolute path", t => {
  const config = {
    configFile: path.join(__dirname, "fixtures/config-block-no-empty.json"),
  }
  t.plan(2)
  postcssPlugin.process("a {}", config).then(result => {
    const warnings = result.warnings()
    t.equal(warnings.length, 1)
    t.ok(warnings[0].text.indexOf("block-no-empty") !== -1)
  })
})

test("checks with ignore-disable-comments should have undefined disabledRanges", t => {
  const source = `/* stylelint-disable block-no-empty */
    a {}`
  const config = {
    configFile: path.join(__dirname, "fixtures/config-block-no-empty.json"),
    ignoreDisableComments: true,
  }
  t.plan(1)
  postcssPlugin.process(source, config).then(result => {
    t.equal(result.stylelint.disabledRanges, undefined)
  }).catch(err => {
    t.equal(err.code, "ENOENT")
  })
})

test("`configFile` with bad path", t => {
  t.plan(1)
  postcssPlugin.process("a {}", { configFile: "./herby.json" }).catch(err => {
    t.equal(err.code, "ENOENT")
  })
})

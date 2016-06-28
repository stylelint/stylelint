import path from "path"
import postcssPlugin from "../postcssPlugin"
import test from "tape"

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

test("`configFile` with bad path", t => {
  t.plan(1)
  postcssPlugin.process("a {}", { configFile: "./herby.json" }).catch(err => {
    t.equal(err.code, "ENOENT")
  })
})

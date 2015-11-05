import test from "tape"
import path from "path"
import sinon from "sinon"
import postcssPlugin from "../postcssPlugin"

test("`configFile` option with absolute path", t => {
  const config = { configFile: path.join(__dirname, "fixtures/config-block-no-empty.json") }
  const warnings = postcssPlugin.process("a {}", config).warnings()
  t.equal(warnings.length, 1)
  t.ok(warnings[0].text.indexOf("block-no-empty") !== -1)
  t.end()
})

test("`configFile` option with relative path", t => {
  const cwdStub = sinon.stub(process, "cwd", () => __dirname)
  const config = { configFile: "./fixtures/config-block-no-empty.json" }
  const warnings = postcssPlugin.process("a {}", config).warnings()
  t.ok(cwdStub.calledOnce)
  t.equal(warnings.length, 1)
  t.ok(warnings[0].text.indexOf("block-no-empty") !== -1)
  cwdStub.restore()
  t.end()
})

test("`configFile` with bad path", t => {
  const config = { configFile: "./herby.json" }
  t.throws(() => {
    postcssPlugin.process("a {}", config).warnings()
  }, /configFile path "\.\/herby\.json" corresponded to no file/)
  t.end()
})

import postcssPlugin from "../postcssPlugin"
import test from "tape"

test("`defaultSeverity` option set to warning", t => {
  const config = {
    defaultSeverity: "warning",
    rules: {
      "block-no-empty": true,
    },
  }
  postcssPlugin.process("a {}", config).then(result => {
    const warnings = result.warnings()
    t.equal(warnings.length, 1)
    t.ok(warnings[0].text.indexOf("block-no-empty") !== -1)
    t.equal(warnings[0].severity, "warning")
    t.end()
  }).catch(t.end)
})

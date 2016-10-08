import postcssPlugin from "../postcssPlugin"
import standalone from "../standalone"
import { stripIndent } from "common-tags"
import test from "tape"

const config = {
  rules: { "block-no-empty": true },
}

const css = stripIndent`
  /* stylelint-disable */
  a {}
  /* stylelint-enable */
  a {
    b {} /* stylelint-disable-line block-no-empty */
  }`

test("ignoreDisables with postcssPlugins", t => {
  postcssPlugin.process(css, {
    config,
    ignoreDisables: true,
  }).then(result => {
    const warnings = result.warnings()
    t.equal(warnings.length, 2)
    t.ok(warnings[0].text.indexOf("block-no-empty") !== 1)
    t.ok(warnings[1].text.indexOf("block-no-empty") !== 1)
    t.end()
  }).catch(t.end)
})

test("ignoreDisables with standalone", t => {
  standalone({
    config,
    code: css,
    ignoreDisables: true,
  }).then(({ results }) => {
    const warnings = results[0].warnings
    t.equal(warnings.length, 2)
    t.ok(warnings[0].text.indexOf("block-no-empty") !== 1)
    t.ok(warnings[1].text.indexOf("block-no-empty") !== 1)
    t.end()
  }).catch(t.end)
})

import stylelint from  ".."
import test from "tape"

import postcssPlugin from "../postcssPlugin"
import standalone from "../standalone"
import createPlugin from "../createPlugin"
import rules from "../rules"
import {
  report,
  ruleMessages,
  styleSearch,
  validateOptions,
} from "../utils"
import ruleTester from "../testUtils/ruleTester"

test("`stylelint` itself", t => {
  t.equal(stylelint, postcssPlugin, "is the PostCSS plugin")
  t.end()
})

test("`stylelint.utils`", t => {
  t.equal(Object.keys(stylelint.utils).length, 5, "correct `stylelint.utils.length`")
  t.equal(stylelint.utils.report, report, "correct `stylelint.utils.report`")
  t.equal(stylelint.utils.ruleMessages, ruleMessages, "correct `stylelint.utils.ruleMessages`")
  t.equal(stylelint.utils.styleSearch, styleSearch, "correct `stylelint.utils.styleSearch`")
  t.equal(stylelint.utils.validateOptions, validateOptions, "correct `stylelint.utils.validateOptions`")
  t.equal(stylelint.utils.ruleTester, ruleTester, "correct `stylelint.utils.ruleTester`")
  t.end()
})

test("other exposed features", t => {
  t.equal(stylelint.lint, standalone, "correct `stylelint.lint`")
  t.equal(stylelint.rules, rules, "correct `stylelint.rules`")
  t.equal(stylelint.createPlugin, createPlugin, "correct `stylelint.createPlugin`")
  t.end()
})

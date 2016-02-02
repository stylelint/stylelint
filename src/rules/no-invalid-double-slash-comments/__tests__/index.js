import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

import scssSyntax from "postcss-scss"

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a { /* color: pink; */ }", "regular comment around declaration")
  tr.ok("/* a { color: pink; } */", "regular comment around rule")
  tr.ok("a { background: url(//foo.com/bar.png) }", "url with double slash")

  tr.notOk(
    "a { // color: pink; }",
    {
      message: messages.rejected,
      line: 1,
      column: 8,
    },
    "before declaration"
  )

  tr.notOk(
    "// a { color: pink; }",
    {
      message: messages.rejected,
      line: 1,
      column: 19,
    },
    "before rule"
  )

  tr.notOk(
    "a, // div { color: pink; }",
    {
      message: messages.rejected,
      line: 1,
      column: 19,
    },
    "between rules"
  )

  tr.notOk(
    "// @media { }",
    {
      message: messages.rejected,
      line: 1,
      column: 19,
    },
    "before media rule"
  )
})

const testRuleScss = ruleTester(rule, ruleName, {
  postcssOptions: {
    syntax: scssSyntax,
  },
})

testRuleScss(undefined, tr => {
  tr.ok("// a { color: pink }", "single-line comment ignored")
})

testRuleScss(undefined, tr => {
  tr.ok("a { \n// color: pink;\n }", "single-line comment ignored")
})

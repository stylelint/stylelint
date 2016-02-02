import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

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


import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(true, tr => {
  tr.ok(
    "a {\ncolor: pink; }",
    "multi-line rule with newline at start"
  )
  tr.ok(
    "a { color: pink;\n}",
    "multi-line rule with newline at end"
  )
  tr.ok(
    "a { color: pink;\nbackground: orange; }",
    "multi-line rule with newline in middle"
  )

  tr.notOk(
    "a { color: pink; }",
    messages.rejected,
    "single-line rule"
  )
  tr.notOk(
    "@media print {\na { color: pink; }}",
    messages.rejected,
    "single-line rule within multi-line at-rule"
  )
})

testRule(false, tr => {
  tr.ok("a {\ncolor: pink;\n}", "multi-line rule")
  tr.ok("a { color: pink; }", "single-line rule")
})

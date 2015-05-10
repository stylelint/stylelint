import { ruleTester } from "../../../testUtils"
import ruleSetNoSingleLine, { ruleName, messages } from ".."

const testRuleSetNoSingleLine = ruleTester(ruleSetNoSingleLine, ruleName)

testRuleSetNoSingleLine(true, tr => {
  tr.ok(
    "a {\ncolor: pink; }",
    "multi-line rule set with newline at start"
  )
  tr.ok(
    "a { color: pink;\n}",
    "multi-line rule set with newline at end"
  )
  tr.ok(
    "a { color: pink;\nbackground: orange; }",
    "multi-line rule set with newline in middle"
  )

  tr.notOk(
    "a { color: pink; }",
    "single-line rule set",
    messages.rejected
  )
  tr.notOk(
    "@media print {\na { color: pink; }}",
    "single-line rule set within multi-line at-rule",
    messages.rejected
  )
})

testRuleSetNoSingleLine(false, tr => {
  tr.ok("a {\ncolor: pink;\n}", "multi-line rule set")
  tr.ok("a { color: pink; }", "single-line rule set")
})

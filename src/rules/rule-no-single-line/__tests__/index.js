import {
  ruleTester
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  tr.ok("")
  tr.ok("@import \"foo.css\";")

  tr.ok(
    "a {\ncolor: pink; }",
    "multi-line rule with newline at start"
  )
  tr.ok(
    "a {\r\ncolor: pink; }",
    "multi-line rule with CRLF at start"
  )
  tr.ok(
    "a { color: pink;\n}",
    "multi-line rule with newline at end"
  )
  tr.ok(
    "a { color: pink;\r\n}",
    "multi-line rule with CRLF at end"
  )
  tr.ok(
    "a { color: pink;\nbackground: orange; }",
    "multi-line rule with newline in middle"
  )
  tr.ok(
    "a { color: pink;\r\nbackground: orange; }",
    "multi-line rule with CRLF in middle"
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
  tr.notOk(
    "@media print {\r\na { color: pink; }}",
    messages.rejected,
    "single-line rule within multi-line at-rule and CRLF"
  )
})

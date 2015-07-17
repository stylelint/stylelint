import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a,\r\nb {}", "CRLF")
  tr.ok("a,\nb,\nc {}")
  tr.ok("a ,\nb {}")
  tr.ok("a\n,\nb {}")
  tr.ok("a\r\n,\r\nb {}", "CRLF")
  tr.ok("a,\nb[data-foo=\"tr,tr\"] {}")
  tr.ok("a {\n  &:hover,\n  &:focus {\n    color: pink; }\n}", "nested in rule set")
  tr.ok("@media (min-width: 10px) {\n  a,\n  b {}\n}", "nested in at-rule")
  tr.ok("@media (min-width: 10px) {\r\n  a,\r\n  b {}\r\n}", "nested in at-rule and CRLF")
  tr.ok("\ta,\n\tb {}", "indented statement")

  tr.notOk("a,b {}", messages.expectedAfter())
  tr.notOk("a, b {}", messages.expectedAfter())
  tr.notOk("a,  b {}", messages.expectedAfter())
  tr.notOk("a,\tb {}", messages.expectedAfter())
  tr.notOk("a,\nb,c {}", messages.expectedAfter())
  tr.notOk("a,\r\nb,c {}", messages.expectedAfter(), "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a,\r\nb {}", "CRLF")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("a, b {\r\n}", "ignores single-line selector list, multi-line block with CRLF")
  tr.ok("\ta,\n\tb {\n}", "indented statement")

  tr.notOk("a,\nb, c {}", messages.expectedAfterMultiLine())
  tr.notOk("a,\nb, c {\n}", messages.expectedAfterMultiLine())
  tr.notOk("a,\r\nb, c {\r\n}", messages.expectedAfterMultiLine(), "CRLF")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a,\nb ,c {}", messages.rejectedAfterMultiLine())
  tr.notOk("a,\r\nb ,c {}", messages.rejectedAfterMultiLine(), "CRLF")
  tr.notOk("a,\nb ,c {\n}", messages.rejectedAfterMultiLine())
})

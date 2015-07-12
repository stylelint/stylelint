import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a, b {}")
  tr.ok("a, b, c {}")
  tr.ok("a , b {}")
  tr.ok("a\n, b {}")
  tr.ok("a\r\n, b {}", "CRLF")

  tr.notOk("a,b {}", messages.expectedAfter())
  tr.notOk("a,  b {}", messages.expectedAfter())
  tr.notOk("a,\nb {}", messages.expectedAfter())
  tr.notOk("a,\r\nb {}", messages.expectedAfter(), "CRLF")
  tr.notOk("a,\tb {}", messages.expectedAfter())
  tr.notOk("a, b,c {}", messages.expectedAfter())
  tr.notOk("a, b,  c {}", messages.expectedAfter())

  tr.ok("a, b[data-foo=\"tr,tr\"] {}", "string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a ,b {}")
  tr.ok("a\n,b {}")
  tr.ok("a\r\n,b {}", "CRLF")

  tr.notOk("a, b {}", messages.rejectedAfter())
  tr.notOk("a,  b {}", messages.rejectedAfter())
  tr.notOk("a,\nb {}", messages.rejectedAfter())
  tr.notOk("a,\r\nb {}", messages.rejectedAfter(), "CRLF")
  tr.notOk("a,\tb {}", messages.rejectedAfter())
  tr.notOk("a,b, c {}", messages.rejectedAfter())
  tr.notOk("a,b,  c {}", messages.rejectedAfter())

  tr.ok("a,b[data-foo=\"tr, tr\"] {}", "string")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a, b {}")
  tr.ok("a, b {\n}", "single-line selector list, multi-line block")
  tr.ok("a, b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a,b {}", messages.expectedAfterSingleLine())
  tr.notOk("a,b {\n}", messages.expectedAfterSingleLine())
  tr.notOk("a,b {\r\n}", messages.expectedAfterSingleLine(), "CRLF")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b {\n}", "single-line selector list, multi-line block")
  tr.ok("a,b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a, b {}", messages.rejectedAfterSingleLine())
  tr.notOk("a, b {\n}", messages.rejectedAfterSingleLine())
  tr.notOk("a, b {\r\n}", messages.rejectedAfterSingleLine(), "CRLF")
})

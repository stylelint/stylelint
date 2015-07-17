import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a\n,b\n,c {}")
  tr.ok("a\r\n,b\r\n,c {}", "CRLF")
  tr.ok("a\n, b {}")
  tr.ok("a\n,\nb {}")
  tr.ok("a\r\n,\r\nb {}", "CRLF")
  tr.ok("a\n,b[data-foo=\"tr,tr\"] {}")
  tr.ok("a\n    ,b {}", "indentation after the newline before the comma")
  tr.ok("a\r\n    ,b {}", "indentation after the CRLF before the comma")
  tr.ok("a\n\t\t,b {}", "indentation after the newline before the comma")
  tr.ok("\ta\n\t, b {}", "indented statement")

  tr.notOk("a,b {}", messages.expectedBefore())
  tr.notOk("a ,b {}", messages.expectedBefore())
  tr.notOk("a  ,b {}", messages.expectedBefore())
  tr.notOk("a\t,b {}", messages.expectedBefore())
  tr.notOk("a\n,b,c {}", messages.expectedBefore())
  tr.notOk("a\r\n,b,c {}", messages.expectedBefore(), "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a\r\n,b {}", "CRLF")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("\ta\n\t, b {\n}", "indented statement")

  tr.notOk("a\n,b, c {}", messages.expectedBeforeMultiLine())
  tr.notOk("a\r\n,b, c {}", messages.expectedBeforeMultiLine(), "CRLF")
  tr.notOk("a\n,b, c {\n}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("a ,b {\r\n}", "ignores single-line selector list, multi-line block with CRLF")

  tr.notOk("a,\nb , c {}", messages.rejectedBeforeMultiLine())
  tr.notOk("a,\nb , c {\n}", messages.rejectedBeforeMultiLine())
  tr.notOk("a,\r\nb , c {\r\n}", messages.rejectedBeforeMultiLine(), "CRLF")
})

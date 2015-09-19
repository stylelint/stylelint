import {
  ruleTester,
  warningFreeBasics,
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

  tr.notOk("a,b {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a, b {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,  b {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\tb {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\nb,c {}", {
    message: messages.expectedAfter(),
    line: 2,
    column: 2,
  })
  tr.notOk("a,\r\nb,c {}", {
    message: messages.expectedAfter(),
    line: 2,
    column: 2,
  }, "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a,\r\nb {}", "CRLF")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("a, b {\r\n}", "ignores single-line selector list, multi-line block with CRLF")
  tr.ok("\ta,\n\tb {\n}", "indented statement")

  tr.notOk("a,\nb, c {}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
  tr.notOk("a,\nb, c {\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  })
  tr.notOk("a,\r\nb, c {\r\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 2,
  }, "CRLF")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a,\nb ,c {}", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\r\nb ,c {}", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 2,
  }, "CRLF")
  tr.notOk("a,\nb ,c {\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 2,
  })
})

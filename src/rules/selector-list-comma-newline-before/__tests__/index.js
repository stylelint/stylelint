import {
  ruleTester,
  warningFreeBasics,
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

  tr.notOk("a,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a ,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a  ,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 4,
  })
  tr.notOk("a\t,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a\n,b,c {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 3,
  })
  tr.notOk("a\r\n,b,c {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 3,
  }, "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a\r\n,b {}", "CRLF")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("\ta\n\t, b {\n}", "indented statement")

  tr.notOk("a\n,b, c {}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 3,
  })
  tr.notOk("a\r\n,b, c {}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 3,
  }, "CRLF")
  tr.notOk("a\n,b, c {\n}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 3,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")
  tr.ok("a ,b {\r\n}", "ignores single-line selector list, multi-line block with CRLF")

  tr.notOk("a,\nb , c {}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 3,
  })
  tr.notOk("a,\nb , c {\n}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 3,
  })
  tr.notOk("a,\r\nb , c {\r\n}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 3,
  }, "CRLF")
})

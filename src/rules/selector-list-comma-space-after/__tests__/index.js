import {
  ruleTester,
  warningFreeBasics,
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

  tr.notOk("a,b {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,  b {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\nb {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\r\nb {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  }, "CRLF")
  tr.notOk("a,\tb {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a, b,c {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 5,
  })
  tr.notOk("a, b,  c {}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 5,
  })

  tr.ok("a, b[data-foo=\"tr,tr\"] {}", "string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a ,b {}")
  tr.ok("a\n,b {}")
  tr.ok("a\r\n,b {}", "CRLF")

  tr.notOk("a, b {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,  b {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\nb {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,\r\nb {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  }, "CRLF")
  tr.notOk("a,\tb {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,b, c {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a,b,  c {}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 4,
  })

  tr.ok("a,b[data-foo=\"tr, tr\"] {}", "string")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a, b {}")
  tr.ok("a, b {\n}", "single-line selector list, multi-line block")
  tr.ok("a, b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a,b {}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,b {\n}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,b {\r\n}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, "CRLF")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b {\n}", "single-line selector list, multi-line block")
  tr.ok("a,b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a, b {}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a, b {\n}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a, b {\r\n}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 2,
  }, "CRLF")
})

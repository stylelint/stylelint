import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a ,b {}")
  tr.ok("a ,b ,c {}")
  tr.ok("a , b {}")
  tr.ok("a ,\nb {}")
  tr.ok("a ,\r\nb {}", "CRLF")

  tr.notOk("a,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 2,
  })
  tr.notOk("a  ,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 4,
  })
  tr.notOk("a\n,b {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a\r\n,b {}", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a\t,b {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a ,b,c {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 5,
  })
  tr.notOk("a ,b  ,c {}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 7,
  })

  tr.ok("a ,b[data-foo=\"tr,tr\"] {}", "string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a, b {}")
  tr.ok("a,\nb {}")
  tr.ok("a,\r\nb {}", "CRLF")

  tr.notOk("a ,b {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a  ,b {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 4,
  })
  tr.notOk("a\n,b {}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a\r\n,b {}", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a\t,b {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 3,
  })
  tr.notOk("a,b ,c {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 5,
  })
  tr.notOk("a,b  ,c {}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 6,
  })

  tr.ok("a,b[data-foo=\"tr ,tr\"] {}", "string")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a ,b {}")
  tr.ok("a ,b {\n}", "single-line selector list, multi-line block")
  tr.ok("a ,b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a,b {}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,b {\n}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  })
  tr.notOk("a,b {\r\n}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 2,
  }, "CRLF")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b {\n}", "single-line selector list, multi-line block")
  tr.ok("a,b {\r\n}", "single-line selector list, multi-line block with CRLF")

  tr.notOk("a ,b {}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a ,b {\n}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 3,
  })
  tr.notOk("a ,b {\r\n}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 3,
  }, "CRLF")
})

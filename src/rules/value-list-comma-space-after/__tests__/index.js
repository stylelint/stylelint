import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")
  tr.notOk("a { background-size: 0,0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size:\n\t0,  0; }", {
    message: messages.expectedAfter(),
    line: 2,
    column: 3,
  })
  tr.notOk("a { background-size: 0,\n0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,\r\n0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  }, "CRLF")
  tr.notOk("a { background-size: 0,\t0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 23,
  })

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.notOk("a { background-size: 0, 0; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,  0; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,\n0; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,\r\n0; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 23,
  }, "CRLF")
  tr.notOk("a { background-size: 0,\t0; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 23,
  })

  tr.ok("a::before { content: \"foo, bar, baz\"; }", "strings")
  tr.ok("a { transform: translate(1, 1); }", "function arguments")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0, 0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0, 0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0\n,0}", "ignores multi-line")
  tr.ok("a { background-size: 0\r\n,0}", "ignores multi-line with CRLF")

  tr.notOk("a { background-size: 0,0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,0;\n}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,0;\r\n}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 23,
  }, "CRLF")
  tr.notOk("a { background-size: 0,  0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,\t0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 23,
  })

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.ok("a { background-size: 0,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0\n,  0}", "ignores multi-line values")
  tr.ok("a { background-size: 0\r\n,  0}", "ignores multi-line values with CRLF")

  tr.notOk("a { background-size: 0, 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0, 0;\n}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0, 0;\r\n}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 23,
  }, "CRLF")
  tr.notOk("a { background-size: 0,  0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0,\t0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 23,
  })

  tr.ok("a::before { content: \"foo, bar, baz\"; }", "strings")
  tr.ok("a { transform: translate(1, 1); }", "function arguments")
})

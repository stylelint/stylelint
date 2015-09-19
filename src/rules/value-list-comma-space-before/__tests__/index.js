import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.notOk("a { background-size: 0, 0; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0  , 0; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 25,
  })
  tr.notOk("a { background-size: 0\n, 0; }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { background-size: 0\r\n, 0; }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a { background-size: 0\t, 0; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 24,
  })

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.notOk("a { background-size: 0 , 0; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 24,
  })
  tr.notOk("a { background-size: 0  , 0; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 25,
  })
  tr.notOk("a { background-size: 0\n, 0; }", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  })
  tr.notOk("a { background-size: 0\r\n, 0; }", {
    message: messages.rejectedBefore(),
    line: 2,
    column: 1,
  }, "CRLF")
  tr.notOk("a { background-size: 0\t, 0; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 24,
  })

  tr.ok("a::before { content: \"foo ,bar ,baz\"; }", "strings")
  tr.ok("a { transform: translate(1 ,1); }", "function arguments")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0 ,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0 ,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0,\n0; }", "ignores multi-line list")
  tr.ok("a { background-size: 0,\r\n0; }", "ignores multi-line list with CRLF")

  tr.notOk("a { background-size: 0, 0; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0, 0;\n}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 23,
  })
  tr.notOk("a { background-size: 0, 0;\r\n}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 23,
  }, "CRLF")
  tr.notOk("a { background-size: 0  , 0; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 25,
  })
  tr.notOk("a { background-size: 0\t, 0; }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.ok("a { background-size: 0,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0 ,\n0; }", "ignores multi-line list")
  tr.ok("a { background-size: 0 ,\r\n0; }", "ignores multi-line list with CRLF")

  tr.notOk("a { background-size: 0 , 0; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })
  tr.notOk("a { background-size: 0 , 0;\n}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })
  tr.notOk("a { background-size: 0 , 0;\r\n}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 24,
  }, "CRLF")
  tr.notOk("a { background-size: 0  , 0; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 25,
  })
  tr.notOk("a { background-size: 0\t, 0; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 24,
  })

  tr.ok("a::before { content: \"foo ,bar ,baz\"; }", "strings")
  tr.ok("a { transform: translate(1 ,1); }", "function arguments")
})

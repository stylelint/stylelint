import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")

  tr.notOk("a { color: pink;}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink;  }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink;\n}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\r\n}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  }, "CRLF")
  tr.notOk("a { color: pink;\t}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink; } b { color: red;}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 34,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;  }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink;\n}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\r\n}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 18,
  }, "CRLF")
  tr.notOk("a { color: pink;\t}", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;} b { color: red; }", {
    message: messages.rejectedBefore(),
    line: 1,
    column: 34,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a,\nb { color: pink; } c { color: red; }", "multi-line rule, single-line block")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\n\ntop: 0;}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red; }")

  tr.notOk("a { color: pink;}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 16,
  })
  tr.notOk("a,\nb { color: pink;}", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 16,
  })
  tr.notOk("a,\r\nb { color: pink;}", {
    message: messages.expectedBeforeSingleLine(),
    line: 2,
    column: 16,
  }, "CRLF")
  tr.notOk("a { color: pink;  }", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink;\t}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink; } b { color: red;}", {
    message: messages.expectedBeforeSingleLine(),
    line: 1,
    column: 34,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")
  tr.ok("a,\nb { color: pink;} b { color: red;}", "multi-line rule, single-line block")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\r\ntop: 0; }", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red;}")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red;}")

  tr.notOk("a { color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a,\nb { color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 17,
  })
  tr.notOk("a,\r\nb { color: pink; }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 2,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink;  }", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink;\t}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;} b { color: red;\t}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 34,
  })
  tr.notOk("a { color: pink;  } b { color: red;}", {
    message: messages.rejectedBeforeSingleLine(),
    line: 1,
    column: 18,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\r\ntop: 0; }b { color: red; }", "CRLF")

  // Ignore single-line
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0;}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 7,
  })
  tr.notOk("a { color: pink;\ntop: 0;  }", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 9,
  })
  tr.notOk("a { color: pink;\ntop: 0;\t}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0;}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 7,
  })
  tr.notOk("a { color: pink;\ntop: 0;} b { color: red; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 7,
  })
  tr.notOk(
    "a { color: pink;\r\ntop: 0;} b { color: red; }",
    {
      message: messages.expectedBeforeMultiLine(),
      line: 2,
      column: 7,
    },
    "CRLF"
  )
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;}")
  tr.ok("a { color: pink;\r\ntop: 0;} b { color: red;}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink;\ntop: 0;  }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 9,
  })
  tr.notOk("a { color: pink;\ntop: 0;\t}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink;\r\ntop: 0;\t}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  }, "CRLF")
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
})

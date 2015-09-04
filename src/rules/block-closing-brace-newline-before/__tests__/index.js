import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\n}")
  tr.ok("a { color: pink;\r\n}", "CRLF")
  tr.ok("a { color: pink;\n\t\t}")
  tr.ok("a { color: pink;\n} b { color: red;\n}")
  tr.ok("a { color: pink;\n}b { color: red;\n}")

  tr.ok("@media print {\n  a {\n     color: pink;\n  }\n}",
    "indentation after the newline before the closing braces")
  tr.ok("@media print {\n\ta {\n\t\tcolor: pink;\n\t\t{\n\t\t\t&:hover;\n\t\t\t}\n\t\t}\n}",
    "3 level deep nesting with indentation after the newline before the closing braces")

  tr.notOk("a { color: pink;}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 16,
  })
  tr.notOk("a { color: pink; }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink; \n}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink; \r\n}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 19,
  }, "CRLF")
  tr.notOk("a { color: pink;  }", {
    message: messages.expectedBefore(),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink;\t}", {
    message: messages.expectedBefore(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\n} b { color: red; }", {
    message: messages.expectedBefore(),
    line: 2,
    column: 18,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0;\n}")
  tr.ok("a { color: pink;\ntop: 0;\n\t\t}")
  tr.ok("a { color: pink;\r\ntop: 0;\r\n\t\t}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;\n} b { color: red;\n}")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red;\n}")

  // Ignore single-line
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0;}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 7,
  })
  tr.notOk("a { color: pink;\r\ntop: 0;}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 7,
  }, "CRLF")
  tr.notOk("a { color: pink;\ntop: 0; }", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink;\ntop: 0; \n}", {
    message: messages.expectedBeforeMultiLine(),
    line: 2,
    column: 9,
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
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\r\ntop: 0;}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;\ntop: 0;}")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink;\t}")
  tr.ok("a { color: pink;  }")

  tr.notOk("a { color: pink;\ntop: 0; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  })
  tr.notOk("a { color: pink;\r\ntop: 0; }", {
    message: messages.rejectedBeforeMultiLine(),
    line: 2,
    column: 8,
  }, "CRLF")
  tr.notOk("a { color: pink;\ntop: 0;\n}", {
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
  tr.notOk("a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;\n}", {
    message: messages.rejectedBeforeMultiLine(),
    line: 3,
    column: 8,
  })
})

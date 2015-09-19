import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink; top: 0}")

  tr.notOk("a { color: pink;top: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;  top: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\ntop: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\r\ntop: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink;\ttop: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block")
  tr.ok("a,\r\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block and CRLF")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")
  tr.ok("a {\r\n  color: pink;\r\n  top: 0;\r\n}", "CRLF")

  tr.notOk("a { color: pink;top: 0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a,\nb { color: pink;top: 0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 17,
  })
  tr.notOk("a,\r\nb { color: pink;top: 0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink;  top: 0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\ttop: 0; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"; a\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink;top: 0; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink; top: 0;\n}")
  tr.ok("a {\r\n  color: pink; top: 0;\r\n}", "CRLF")

  tr.notOk("a { color: pink; top: 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a,\nb { color: pink; top: 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 17,
  })
  tr.notOk("a,\r\nb { color: pink; top: 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 2,
    column: 17,
  }, "CRLF")
  tr.notOk("a { color: pink;  top: 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\ttop: 0; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 17,
  })
})

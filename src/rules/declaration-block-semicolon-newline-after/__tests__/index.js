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
  tr.ok("a::before { content: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a {\r\ncolor: pink;\r\n\ttop:0;\r\n}", "CRLF")
  tr.ok("a { color: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink;\r\ntop: 0;}", "no space between trailing semicolon and closing brace and CRLF")
  tr.ok("a { color: pink;\ntop: 0}")
  tr.ok("a {\n  color: pink; /* 1 */\n  top: 0\n}", "end-of-line comment")
  tr.ok("a {\r\n  color: pink; /* 1 */\r\n  top: 0\r\n}", "end-of-line comment and CRLF")
  tr.ok("a {\n  color: pink;\n  /* 1 */\n  top: 0\n}", "next-line comment")
  tr.ok("a,\nb { color: pink;\ntop: 0}", "multi-line rule, multi-line declaration-block")
  tr.ok("a,\r\nb { color: pink;\r\ntop: 0}", "multi-line rule, multi-line declaration-block and CRLF")

  tr.notOk("a { color: pink;top: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink; top: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink; top: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk("a { color: pink;\ttop: 0; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 17,
  })
  tr.notOk(
    "a {\n  color: pink;  /* 1 */\n  top: 0\n}",
    {
      message: messages.expectedAfter(),
      line: 2,
      column: 15,
    },
    "end-of-line comment with two spaces before"
  )
  tr.notOk(
    "a {\n  color: pink; /* 1 */ top: 0\n}",
    {
      message: messages.expectedAfter(),
      line: 2,
      column: 15,
    },
    "next node is comment without newline after"
  )
  tr.notOk(
    "a {\r\n  color: pink; /* 1 */ top: 0\r\n}",
    {
      message: messages.expectedAfter(),
      line: 2,
      column: 15,
    },
    "CRLF and next node is comment without newline after"
  )
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";a\";\n}")
  tr.ok("a::before {\r\ncontent: \";a\";\r\n}", "CRLF")
  tr.ok("a {\ncolor: pink;\n top:0;\n}")
  tr.ok("a {\ncolor: pink;\n  top:0;\n}")
  tr.ok("a {\r\ncolor: pink;\r\n  top:0;\r\n}", "CRLF")
  tr.ok("a {\ncolor: pink;\n\ttop:0;\n}")
  tr.ok("a {\ncolor: pink;\ntop: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;\ntop: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a { color: pink; /* 1 */ top: 0; }")
  tr.ok("a,\nb { color: pink; top: 0}", "multi-line rule, single-line declaration-block")
  tr.ok("a,\r\nb { color: pink; top: 0}", "multi-line rule, single-line declaration-block and CRLF")

  tr.notOk("a {\ncolor: pink;top: 0;\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\ncolor: pink; top: 0;\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\r\ncolor: pink; top: 0;\r\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  }, "CRLF")
  tr.notOk("a {\ncolor: pink; top: 0;\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\r\ncolor: pink;\ttop: 0;\r\n}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 13,
  }, "CRLF")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a {\r\ncolor: pink;\r\n}", "CRLF")
  tr.ok("a::before {\ncontent: \";\na\";\n}")
  tr.ok("a {\ncolor: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a {\ncolor: pink;top: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")
  tr.ok("a,\nb { color: pink; top: 0}", "multi-line rule, single-line declaration-block")

  tr.notOk("a {\ncolor: pink; top: 0;\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\ncolor: pink;  top: 0;\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\ncolor: pink;\ntop: 0;\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
  tr.notOk("a {\r\ncolor: pink;\r\ntop: 0;\r\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 13,
  }, "CRLF")
  tr.notOk("a {\ncolor: pink;\ttop: 0;\n}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 13,
  })
})

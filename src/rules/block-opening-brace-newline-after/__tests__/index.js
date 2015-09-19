import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@import url(x.css)")
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\r\ncolor: pink; }", "CRLF")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("a{\r\n  color: pink; }", "CRLF")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\r\na{\r\ncolor: pink; } }", "CRLF")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")
  tr.ok("a { /* 1 */\n  color: pink;\n}", "end-of-line comment")
  tr.ok("a {\n  /* 1 */\n  color: pink;\n}", "next-line comment")
  tr.ok("a {\r\n  /* 1 */\r\n  color: pink;\r\n}", "next-line comment and CRLF")

  tr.notOk("a { color: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {color: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 4,
  })
  tr.notOk("@media print { a {\ncolor: pink; } }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print {\na { color: pink; } }", {
    message: messages.expectedAfter(),
    line: 2,
    column: 4,
  })
  tr.notOk("@media print {\r\na { color: pink; } }", {
    message: messages.expectedAfter(),
    line: 2,
    column: 4,
  }, "CRLF")
  tr.notOk(
    "a {  /* 1 */\n  color: pink;\n}",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 4,
    },
    "end-of-line comment with two spaces before"
  )
  tr.notOk(
    "a {  /* 1 */\r\n  color: pink;\r\n}",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 4,
    },
    "end-of-line comment with two spaces before and CRLF"
  )
  tr.notOk(
    "a { /* 1 */ color: pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 4,
    },
    "next node is comment without newline after"
  )
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  // Regular "always" tests
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\n  color: pink;\n  background: orange; }")
  tr.ok("a {\r\n  color: pink;\r\n  background: orange; }", "CRLF")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print {\r\na {\r\ncolor: pink; } }", "CRLF")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")
  tr.ok("@media print{\r\n\ta{\r\n  color: pink; } }", "CRLF")

  tr.notOk("a { color: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {color: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {  color: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\r\nbackground: orange; }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("@media print { a {\ncolor:\npink; } }", {
    message: messages.expectedAfterMultiLine(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print {\na { color:\npink; } }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 4,
  })
  tr.notOk("@media print {\r\na { color:\r\npink; } }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 4,
  }, "CRLF")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("a {  color: pink;  background: orange; }")
  tr.ok("a { /* 1 */ color: pink; }")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {color: pink;\nbackground: orange; }")
  tr.ok("a {color: pink;\r\nbackground: orange; }", "CRLF")
  tr.ok("a{color: pink;\nbackground: orange; }")
  tr.ok("@media print {a {color: pink;\nbackground: orange; } }")
  tr.ok("@media print{a{color: pink;\nbackground: orange; } }")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("@media print {\ta {\tcolor: pink; } }")

  tr.notOk("a { color: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\r\ncolor: pink;\r\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  }, "CRLF")
  tr.notOk("a {  color: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 4,
  })
  tr.notOk("@media print {\na {color: pink;\nbackground: orange; } }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 15,
  })
  tr.notOk("@media print {a {\ncolor: pink;\nbackground: orange; } }", {
    message: messages.rejectedAfterMultiLine(),
    line: 1,
    column: 18,
  })
})

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
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("@media print { a { color: pink; } b { color: red; } }")
  tr.ok("@media print { a { color: pink; } } @media screen { b { color: red; } }")
  tr.ok("@import 'foo.css';\n@import 'bar.css';", "two blockless statements")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; } b { color: red; }}")
  tr.ok("@media print { a { color: pink; }} @media screen { b { color: red; }}")

  tr.notOk("a { color: pink; }b { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }  b { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\nb { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\r\nb { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  }, "CRLF")
  tr.notOk("a { color: pink; }\tb { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a { color: pink; }b { color: red; }}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }}@media screen { b { color: red; }}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 35,
  })
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; } }")
  tr.ok("@media print { a { color: pink; } }@media screen { b { color: red; } }")

  tr.notOk("a { color: pink; } b { color: red; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }  b { color: red; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\nb { color: red; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\r\nb { color: red; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 19,
  }, "CRLF")
  tr.notOk("a { color: pink; }\tb { color: red; }", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", {
    message: messages.rejectedAfter(),
    line: 1,
    column: 35,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; background: orange; }")
  tr.ok("a { color: pink; background: orange; } b { color: red; }")
  tr.ok("a { color: pink; background: orange;} b { color: red;}")

  // Ignore multi line
  tr.ok("a { color:\npink;}")
  tr.ok("a { color:\r\npink;}", "CRLF")
  tr.ok("a { color:\npink;}b { color: red; }")
  tr.ok("a { color:\npink;}b { color:\nred;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; } b { color: red;}}")
  tr.ok("@media print { a {\ncolor: pink; }} @media screen { b { color: red;}}")
  tr.ok("@media print { a {\r\ncolor: pink; }} @media screen { b { color: red;}}", "CRLF")

  tr.notOk("a { color: pink; background: orange;}b { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("a { color: pink; background: orange;}  b { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("a { color: pink; background: orange;}\tb { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("@media print { a { color: pink; }b { color: red; }}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }}@media screen { b { color: red; }}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 35,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; background: orange; }")
  tr.ok("a { color: pink; background: orange; }b { color: red; }")
  tr.ok("a { color: pink; background: orange;}b { color: red;}")

  // Ignore multi line
  tr.ok("a { color:\npink;}")
  tr.ok("a { color:\r\npink;}", "CRLF")
  tr.ok("a { color:\npink;} b { color: red; }")
  tr.ok("a { color:\npink;} b { color:\nred;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink;} b { color: red;} }")
  tr.ok("@media print { a {\r\ncolor: pink;} b { color: red;} }", "CRLF")
  tr.ok("@media print { a {\ncolor: pink;} } @media screen { b { color: red;} }")

  tr.notOk("a { color: pink; background: orange;} b { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("a { color: pink; background: orange;}  b { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("a { color: pink; background: orange;}\tb { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 38,
  })
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 35,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("a { color: pink;\r\nbackground: orange; }", "CRLF")
  tr.ok("a { color: pink;\nbackground: orange; } b { color: red; }")
  tr.ok("a { color: pink;\nbackground: orange;} b { color: red;}")

  // Ignore single line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; } b { color: red; }}")
  tr.ok("@media print { a {\r\ncolor: pink; } b { color: red; }}", "CRLF")
  tr.ok("@media print { a {\ncolor: pink; }} @media screen { b { color: red; }}")

  tr.notOk("a { color: pink;\nbackground: orange;}b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("a { color: pink;\nbackground: orange;}  b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("a { color: pink;\nbackground: orange;}\nb { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk(
    "a { color: pink;\r\nbackground: orange;}\r\nb { color: red; }",
    {
      message: messages.expectedAfterMultiLine(),
      line: 2,
      column: 21,
    },
    "CRLF"
  )
  tr.notOk("a { color: pink;\nbackground: orange;}\tb { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("@media print { a {\ncolor: pink; }b { color: red; }}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 15,
  })
  tr.notOk("@media print { a {\ncolor: pink; }}@media screen { b {\ncolor: red; }}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 16,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("a { color: pink;\r\nbackground: orange; }", "CRLF")
  tr.ok("a { color: pink;\nbackground: orange; }b { color: red; }")
  tr.ok("a { color: pink;\nbackground: orange;}b { color: red;}")

  // Ignore single line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink;} b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; }b { color: red; } }")
  tr.ok("@media print { a {\r\ncolor: pink; }b { color: red; } }", "CRLF")
  tr.ok("@media print { a {\ncolor: pink; }}@media screen { b { color: red; } }")

  tr.notOk("a { color: pink;\nbackground: orange;} b { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("a { color: pink;\nbackground: orange;}  b { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("a { color: pink;\nbackground: orange;}\nb { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("a { color: pink;\nbackground: orange;}\tb { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 21,
  })
  tr.notOk("@media print { a {\ncolor: pink; } b { color: red; }}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 15,
  })
  tr.notOk(
    "@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}",
    {
      message: messages.rejectedAfterMultiLine(),
      line: 2,
      column: 16,
    }
  )
  tr.notOk(
    "@media print { a {\r\ncolor: pink; }} @media screen { b {\r\ncolor: red; }}",
    {
      message: messages.rejectedAfterMultiLine(),
      line: 2,
      column: 16,
    },
    "CRLF"
  )
})

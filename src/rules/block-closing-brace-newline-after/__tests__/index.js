import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink; }\r\nb { color: red; }", "CRLF")
  tr.ok("a { color: pink;}\n\t\tb { color: red;}")
  tr.ok("a { color: pink;}\r\n\t\tb { color: red;}", "CRLF")
  tr.ok("a { @extend foo; color: pink; }")
  tr.ok("a { @extend foo; /* comment */\ncolor: pink;  }")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }\nb { color: red; }}")
  tr.ok("@media print { a { color: pink; }}\n@media screen { b { color: red; }}")

  tr.notOk("a { color: pink; }b { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; } b { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }  b { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\tb { color: red; }", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 35,
  })
})

testRule("always", { ignoreAtRules: [ "if", "else" ] }, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }\nb {}")
  tr.ok("@if ... { color: pink; } @else {}")
  tr.ok("@if ... { color: pink; } @else if {} else {}")
  tr.ok("@if ... {\r\n  color: pink; \n} @else if {\n  color: pink;\n} else {}")

  tr.notOk("a { color: pink; }b{}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
})

testRule("always", { ignoreAtRules: "/if/" }, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }\nb {}")
  tr.ok("@if ... { color: pink; } @else {}")

  tr.notOk("a { color: pink; }b{}", {
    message: messages.expectedAfter(),
    line: 1,
    column: 19,
  })
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink; }\r\nb { color: red; }", "CRLF")
  tr.ok("a { color: pink;}\n\t\tb { color: red;}")
  tr.ok("a { color: pink;}\r\n\t\tb { color: red;}", "CRLF")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }\nb { color: red; }}")
  tr.ok("@media print { a { color: pink; }}\n@media screen { b { color: red; }}")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")
  tr.ok("a { color: pink;\r\ntop: 0;}b { color: red;}", "CRLF")

  tr.notOk("a { color: pink; }b { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; } b { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }  b { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\tb { color: red; }", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", {
    message: messages.expectedAfterSingleLine(),
    line: 1,
    column: 35,
  })
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; }}")
  tr.ok("@media print { a { color: pink; }}@media screen { b { color: red; }}")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }\nb { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;}")

  tr.notOk("a { color: pink; }\nb { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; } b { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }  b { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("a { color: pink; }\tb { color: red; }", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 19,
  })
  tr.notOk("@media print { a { color: pink; }\nb { color: red; }}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 34,
  })
  tr.notOk("@media print { a { color: pink; }}\n @media screen { b { color: red; }}", {
    message: messages.rejectedAfterSingleLine(),
    line: 1,
    column: 35,
  })
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; }\nb { color: red; }")
  tr.ok("a { color: pink;\r\ntop: 0; }\r\nb { color: red; }", "CRLF")
  tr.ok("a { color: pink;\ntop: 0;}\n\t\tb { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; }\nb { color: red; }}")
  tr.ok("@media print { a {\ncolor: pink; }}\n@media screen { b { color: red; }}")

  // Ignore single-line
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink; }b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0; }b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("a { color: pink;\r\ntop: 0; }b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 10,
  }, "CRLF")
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("a { color: pink;\ntop: 0; }  b { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("a { color: pink;\ntop: 0; }\tb { color: red; }", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("@media print { a {\ncolor: pink; } b { color: red; }}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 15,
  })
  tr.notOk("@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}", {
    message: messages.expectedAfterMultiLine(),
    line: 2,
    column: 16,
  })
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")
  tr.ok("a { color: pink;\r\ntop: 0;}b { color: red;}", "CRLF")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; }b { color: red; }}")
  tr.ok("@media print { a {\ncolor: pink; }}@media screen { b { color: red; }}")
  tr.ok("@media print { a {\r\ncolor: pink; }}@media screen { b { color: red; }}", "CRLF")

  // Ignore single-line
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink; }\r\nb { color: red; }", "CRLF")
  tr.ok("a { color: pink;} b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0; }\nb { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk(
    "a { color: pink;\r\ntop: 0; }\r\nb { color: red; }",
    {
      message: messages.rejectedAfterMultiLine(),
      line: 2,
      column: 10,
    },
    "CRLF"
  )
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("a { color: pink;\ntop: 0; }  b { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("a { color: pink;\ntop: 0; }\tb { color: red; }", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 10,
  })
  tr.notOk("@media print { a {\ncolor: pink; }\nb { color: red; }}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 15,
  })
  tr.notOk("@media print { a {\ncolor: pink; }}\n@media screen { b {\ncolor: red; }}", {
    message: messages.rejectedAfterMultiLine(),
    line: 2,
    column: 16,
  })
})

import {
  ruleTester,
  warningFreeBasics
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

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\r\nb { color: red; }", messages.expectedAfter(), "CRLF")
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; }b { color: red; }}", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; }}@media screen { b { color: red; }}", messages.expectedAfter())
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; } }")
  tr.ok("@media print { a { color: pink; } }@media screen { b { color: red; } }")

  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\r\nb { color: red; }", messages.rejectedAfter(), "CRLF")
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", messages.rejectedAfter())
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

  tr.notOk("a { color: pink; background: orange;}b { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink; background: orange;}  b { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink; background: orange;}\tb { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }b { color: red; }}", messages.expectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }}@media screen { b { color: red; }}", messages.expectedAfterSingleLine())
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

  tr.notOk("a { color: pink; background: orange;} b { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink; background: orange;}  b { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink; background: orange;}\tb { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", messages.rejectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", messages.rejectedAfterSingleLine())
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

  tr.notOk("a { color: pink;\nbackground: orange;}b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}  b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}\nb { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk(
    "a { color: pink;\r\nbackground: orange;}\r\nb { color: red; }",
    messages.expectedAfterMultiLine(),
    "CRLF"
  )
  tr.notOk("a { color: pink;\nbackground: orange;}\tb { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }b { color: red; }}", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }}@media screen { b {\ncolor: red; }}", messages.expectedAfterMultiLine())
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

  tr.notOk("a { color: pink;\nbackground: orange;} b { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}  b { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}\nb { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}\tb { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; } b { color: red; }}", messages.rejectedAfterMultiLine())
  tr.notOk(
    "@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}",
    messages.rejectedAfterMultiLine()
  )
  tr.notOk(
    "@media print { a {\r\ncolor: pink; }} @media screen { b {\r\ncolor: red; }}",
    messages.rejectedAfterMultiLine(),
    "CRLF"
  )
})

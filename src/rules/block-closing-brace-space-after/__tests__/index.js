import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("@media print { a { color: pink; } b { color: red; } }")
  tr.ok("@media print { a { color: pink; } } @media screen { b { color: red; } }")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; } b { color: red; }}")
  tr.ok("@media print { a { color: pink; }} @media screen { b { color: red; }}")

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; }b { color: red; }}", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; }}@media screen { b { color: red; }}", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; } }")
  tr.ok("@media print { a { color: pink; } }@media screen { b { color: red; } }")

  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", messages.rejectedAfter())
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("a { color: pink;\nbackground: orange; } b { color: red; }")
  tr.ok("a { color: pink;\nbackground: orange;} b { color: red;}")

  // Ignore single line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; } b { color: red; }}")
  tr.ok("@media print { a {\ncolor: pink; }} @media screen { b { color: red; }}")

  tr.notOk("a { color: pink;\nbackground: orange;}b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}  b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}\nb { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange;}\tb { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }b { color: red; }}", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }}@media screen { b {\ncolor: red; }}", messages.expectedAfterMultiLine())
})

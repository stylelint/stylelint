import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink;}\n\t\tb { color: red;}")
  tr.ok("a { @extend foo; color: pink; }")
  tr.ok("a { @extend foo; /* comment */\ncolor: pink;  }")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }\nb { color: red; }}")
  tr.ok("@media print { a { color: pink; }}\n@media screen { b { color: red; }}")

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; } b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", messages.expectedAfter())
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; } }")
  tr.ok("@media print { a { color: pink; } }@media screen { b { color: red; } }")

  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; }\nb { color: red; }}", messages.rejectedAfter())
  tr.notOk("@media print { a { color: pink; }}\n @media screen { b { color: red; }}", messages.rejectedAfter())
})

testRule("always-single-line", tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink;}\n\t\tb { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }\nb { color: red; }}")
  tr.ok("@media print { a { color: pink; }}\n@media screen { b { color: red; }}")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink; } b { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; } b { color: red; }}", messages.expectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }} @media screen { b { color: red; }}", messages.expectedAfterSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a { color: pink; }b { color: red; }}")
  tr.ok("@media print { a { color: pink; }}@media screen { b { color: red; }}")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }\nb { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;}")

  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }\nb { color: red; }}", messages.rejectedAfterSingleLine())
  tr.notOk("@media print { a { color: pink; }}\n @media screen { b { color: red; }}", messages.rejectedAfterSingleLine())
})

testRule("always-multi-line", tr => {
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; }\nb { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;}\n\t\tb { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; }\nb { color: red; }}")
  tr.ok("@media print { a {\ncolor: pink; }}\n@media screen { b { color: red; }}")

  // Ignore single-line
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink; }b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0; }b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; }  b { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; }\tb { color: red; }", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; } b { color: red; }}", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }} @media screen { b {\ncolor: red; }}", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")

  // Ignores nested closing braces
  tr.ok("@media print { a {\ncolor: pink; }b { color: red; }}")
  tr.ok("@media print { a {\ncolor: pink; }}@media screen { b { color: red; }}")

  // Ignore single-line
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink;} b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0; }\nb { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; }  b { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; }\tb { color: red; }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }\nb { color: red; }}", messages.rejectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor: pink; }}\n@media screen { b {\ncolor: red; }}", messages.rejectedAfterMultiLine())
})

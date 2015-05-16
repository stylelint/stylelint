import { ruleTester } from "../../../testUtils"
import blockClosingBraceNewline, { ruleName, messages } from ".."

const testBlockClosingBraceNewline = ruleTester(blockClosingBraceNewline, ruleName)

testBlockClosingBraceNewline({ before: "always" }, tr => {
  tr.ok("a { color: pink;\n}")
  tr.ok("a { color: pink;\n\t\t}")
  tr.ok("a { color: pink;\n} b { color: red;\n}")
  tr.ok("a { color: pink;\n}b { color: red;\n}")

  tr.notOk("a { color: pink;}", messages.expectedBefore())
  tr.notOk("a { color: pink; }", messages.expectedBefore())
  tr.notOk("a { color: pink; \n}", messages.expectedBefore())
  tr.notOk("a { color: pink;  }", messages.expectedBefore())
  tr.notOk("a { color: pink;\t}", messages.expectedBefore())
  tr.notOk("a { color: pink;\n} b { color: red; }", messages.expectedBefore())
})

testBlockClosingBraceNewline({ before: "never" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red;\n}", messages.rejectedBefore())
})

testBlockClosingBraceNewline({ after: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }\nb { color: red; }")
  tr.ok("a { color: pink;}\n\t\tb { color: red;}")

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; } b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfter())
})

testBlockClosingBraceNewline({ after: "never" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfter())
})

testBlockClosingBraceNewline({ before: "always", after: "always" }, tr => {
  tr.ok("a { color: pink;\n}")
  tr.ok("a { color: pink;\n}\n\tb { color: red;\n  }")

  tr.notOk("a { color: pink;}\nb { color: red;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}\nb { color: red; }", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}b { color: red;\n}", messages.expectedAfter())
  tr.notOk("a { color: pink;\n} b { color: red;\n}", messages.expectedAfter())
})

testBlockClosingBraceNewline({ before: "always", after: "never" }, tr => {
  tr.ok("a { color: pink;\n}")
  tr.ok("a { color: pink;\n}b { color: red;\n  }")

  tr.notOk("a { color: pink;}b { color: red;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}b { color: red; }", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}   \nb { color: red;\n}", messages.rejectedAfter())
  tr.notOk("a { color: pink;\n} b { color: red;\n}", messages.rejectedAfter())
})

testBlockClosingBraceNewline({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;}\nb { color: red;}")
  tr.ok("a { color: pink;}\n  b { color: red;}")

  tr.notOk("a { color: pink;\n}\nb { color: red;}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}\nb { color: red;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}b { color: red;}", messages.expectedAfter())
  tr.notOk("a { color: pink;} b { color: red;}", messages.expectedAfter())
})

testBlockClosingBraceNewline({ before: "never", after: "never" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink;\n}b { color: red;}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}b { color: red;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}\nb { color: red;}", messages.rejectedAfter())
  tr.notOk("a { color: pink;} b { color: red;}", messages.rejectedAfter())
})

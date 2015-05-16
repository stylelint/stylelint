import { ruleTester } from "../../../testUtils"
import blockOpeningBraceSpace, { ruleName, messages } from ".."

const testBlockOpeningBraceSpace = ruleTester(blockOpeningBraceSpace, ruleName)

testBlockOpeningBraceSpace({ before: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")

  tr.notOk("a { color: pink;}", messages.expectedBefore())
  tr.notOk("a { color: pink;  }", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink;\t}", messages.expectedBefore())
  tr.notOk("a { color: pink; } b { color: red;}", messages.expectedBefore())
})

testBlockOpeningBraceSpace({ before: "never" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red; }", messages.rejectedBefore())
})

testBlockOpeningBraceSpace({ after: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink;} b { color: red;}")

  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.expectedAfter())
})

testBlockOpeningBraceSpace({ after: "never" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }  b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\tb { color: red; }", messages.rejectedAfter())
})

testBlockOpeningBraceSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")

  tr.notOk("a { color: pink;} b { color: red; }", messages.expectedBefore())
  tr.notOk("a { color: pink; } b { color: red;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink; }b { color: red; }", messages.expectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.expectedAfter())
})

testBlockOpeningBraceSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")

  tr.notOk("a { color: pink; } b { color: red;}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}b { color: red;}", messages.expectedAfter())
  tr.notOk("a { color: pink;}\nb { color: red;}", messages.expectedAfter())
})

testBlockOpeningBraceSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }b { color: red; }")

  tr.notOk("a { color: pink;}b { color: red; }", messages.expectedBefore())
  tr.notOk("a { color: pink; }b { color: red;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink; } b { color: red; }", messages.rejectedAfter())
  tr.notOk("a { color: pink; }\nb { color: red; }", messages.rejectedAfter())
})

testBlockOpeningBraceSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }b { color: red;}", messages.rejectedBefore())
  tr.notOk("a { color: pink;}b { color: red;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red;}", messages.rejectedAfter())
  tr.notOk("a { color: pink;}\nb { color: red;}", messages.rejectedAfter())
})

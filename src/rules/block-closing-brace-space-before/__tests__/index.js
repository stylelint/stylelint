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
  tr.ok("a { color: pink; }b { color: red; }")

  tr.notOk("a { color: pink;}", messages.expectedBefore())
  tr.notOk("a { color: pink;  }", messages.expectedBefore())
  tr.notOk("a { color: pink;\n}", messages.expectedBefore())
  tr.notOk("a { color: pink;\t}", messages.expectedBefore())
  tr.notOk("a { color: pink; } b { color: red;}", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red; }", messages.rejectedBefore())
})

testRule("always-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; } b { color: red; }")
  tr.ok("a { color: pink; }b { color: red; }")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red; }")

  tr.notOk("a { color: pink;}", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink;  }", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink;\t}", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink; } b { color: red;}", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  // Ignore multi-line
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0;  } b { color: red;}")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;  }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;\t}", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;} b { color: red;\t}", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink;  } b { color: red;}", messages.rejectedBeforeSingleLine())
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\ntop: 0; }")
  tr.ok("a { color: pink;\ntop: 0; } b { color: red; }")
  tr.ok("a { color: pink;\ntop: 0; }b { color: red; }")

  // Ignore single-line
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0;}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0;}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;} b { color: red; }", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;}")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;}")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink;  } b { color: red; }")
  tr.ok("a { color: pink;\t}b { color: red; }")

  tr.notOk("a { color: pink;\ntop: 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink; } b { color: red;\ntop: 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; } b { color: red; }", messages.rejectedBeforeMultiLine())
})

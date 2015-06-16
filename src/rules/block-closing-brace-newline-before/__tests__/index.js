import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
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

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\n}", messages.rejectedBefore())
  tr.notOk("a { color: pink;  }", messages.rejectedBefore())
  tr.notOk("a { color: pink;\t}", messages.rejectedBefore())
  tr.notOk("a { color: pink;} b { color: red;\n}", messages.rejectedBefore())
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\ntop: 0;\n}")
  tr.ok("a { color: pink;\ntop: 0;\n\t\t}")
  tr.ok("a { color: pink;\ntop: 0;\n} b { color: red;\n}")
  tr.ok("a { color: pink;\ntop: 0;\n}b { color: red;\n}")

  // Ignore single-line
  tr.ok("a { color: pink;}")
  tr.ok("a { color: pink;} b { color: red;}")
  tr.ok("a { color: pink;}b { color: red;}")

  tr.notOk("a { color: pink;\ntop: 0;}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0; \n}", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;}")
  tr.ok("a { color: pink;\ntop: 0;}b { color: red;\ntop: 0;}")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink;\t}")
  tr.ok("a { color: pink;  }")

  tr.notOk("a { color: pink;\ntop: 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\n}", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;  }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;\t}", messages.rejectedBeforeMultiLine())
  tr.notOk("a { color: pink;\ntop: 0;} b { color: red;\ntop: 0;\n}", messages.rejectedBeforeMultiLine())
})

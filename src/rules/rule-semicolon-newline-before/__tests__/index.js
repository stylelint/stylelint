import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink\n; }")
  tr.ok("a::before { content: \";a\"\n; }")
  tr.ok("a { color: pink\n;top: 0 }")
  tr.ok("a { color: pink\n;top: 0}")

  tr.notOk("a { color: pink;top: 0 }", messages.expectedBefore())
  tr.notOk("a { color: pink ;top: 0 }", messages.expectedBefore())
  tr.notOk("a { color: pink  ;top: 0 }", messages.expectedBefore())
  tr.notOk("a { color: pink\t;top: 0 }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink;top: 0 }")
  tr.ok("a { color: pink;top: 0}")

  tr.notOk("a { color: pink\n;top: 0 }", messages.rejectedBefore())
  tr.notOk("a { color: pink ;top: 0 }", messages.rejectedBefore())
  tr.notOk("a { color: pink  ;top: 0 }", messages.rejectedBefore())
  tr.notOk("a { color: pink\t;top: 0 }", messages.rejectedBefore())
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a {\ncolor: pink\n; }")
  tr.ok("a::before {\ncontent: \";a\"\n; }")
  tr.ok("a {\ncolor: pink\n;top: 0 }")
  tr.ok("a {\ncolor: pink\n;top: 0}")

  // Ignore single-line
  tr.ok("a { color: pink;top: 0; }")

  tr.notOk("a {\ncolor: pink;top: 0\n}", messages.expectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink ;top: 0\n}", messages.expectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink  ;top: 0\n}", messages.expectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink\t;top: 0\n}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a {\ncolor: pink;\n}")
  tr.ok("a::before {\ncontent: \";a\";\n}")
  tr.ok("a {\ncolor: pink;\ntop: 0 }")
  tr.ok("a {\ncolor: pink;\ntop: 0}")

  // Ignore single-line
  tr.ok("a { color: pink; top: 0; }")

  tr.notOk("a {\ncolor: pink\n;top: 0\n}", messages.rejectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink ;top: 0\n}", messages.rejectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink  ;top: 0\n}", messages.rejectedBeforeMultiLine())
  tr.notOk("a {\ncolor: pink\t;top: 0\n}", messages.rejectedBeforeMultiLine())
})

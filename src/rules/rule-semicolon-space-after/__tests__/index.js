import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink; top: 0}")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;  top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\ntop: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"; a\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")

  tr.notOk("a { color: pink; top: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;  top: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;\ntop: 0; }", messages.rejectedAfter())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.rejectedAfter())
})

testRule("always-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink;  top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfterSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"; a\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")

  // Ignore multi-line
  tr.ok("a {\n  color: pink; top: 0;\n}")

  tr.notOk("a { color: pink; top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink;  top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.rejectedAfterSingleLine())
})

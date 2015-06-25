import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
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

testRule("always-single-line", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a,\nb { color: pink;top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink;  top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfterSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"; a\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink;top: 0; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink; top: 0;\n}")

  tr.notOk("a { color: pink; top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a,\nb { color: pink; top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink;  top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.rejectedAfterSingleLine())
})

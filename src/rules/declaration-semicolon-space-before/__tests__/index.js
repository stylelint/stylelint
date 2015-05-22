import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink ; }")
  tr.ok("a::before { content: \";a\" ; }")
  tr.ok("a { color: pink ; top: 0 ; }")
  tr.ok("a { color: pink ; top: 0}")

  tr.notOk("a { color: pink; }", messages.expectedBefore())
  tr.notOk("a { color: pink  ; }", messages.expectedBefore())
  tr.notOk("a { color: pink\t; }", messages.expectedBefore())
  tr.notOk("a { color: pink\n; }", messages.expectedBefore())
  tr.notOk("a { color: pink ; top: 0; }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0; }")

  tr.notOk("a { color: pink ; }", messages.rejectedBefore())
  tr.notOk("a { color: pink  ; }", messages.rejectedBefore())
  tr.notOk("a { color: pink\t; }", messages.rejectedBefore())
  tr.notOk("a { color: pink\n; }", messages.rejectedBefore())
  tr.notOk("a { color: pink; top: 0 ; }", messages.rejectedBefore())
})

testRule("always-single-line", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink ; }")
  tr.ok("a::before { content: \";a\" ; }")
  tr.ok("a { color: pink ; top: 0 ; }")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")

  tr.notOk("a { color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink  ; }", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink\t; }", messages.expectedBeforeSingleLine())
  tr.notOk("a { color: pink ; top: 0; }", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("a {}")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0; }")

  // Ignore multi-line
  tr.ok("a {\n  color: pink ;\n  top: 0 ;\n}")

  tr.notOk("a { color: pink ; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink  ; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink\t; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink; top: 0 ; }", messages.rejectedBeforeSingleLine())
})

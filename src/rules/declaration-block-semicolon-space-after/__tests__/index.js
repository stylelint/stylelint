import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a { color: pink; top: 0}")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;  top: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\ntop: 0; }", messages.expectedAfter())
  tr.notOk("a { color: pink;\r\ntop: 0; }", messages.expectedAfter(), "CRLF")
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfter())
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \";a\"; }")
  tr.ok("a { color: pink; top: 0;}", "no space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block")
  tr.ok("a,\r\nb { color: pink; top: 0; }", "multi-line rule, single-line declaration-block and CRLF")

  // Ignore multi-line
  tr.ok("a {\n  color: pink;\n  top: 0;\n}")
  tr.ok("a {\r\n  color: pink;\r\n  top: 0;\r\n}", "CRLF")

  tr.notOk("a { color: pink;top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a,\nb { color: pink;top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a,\r\nb { color: pink;top: 0; }", messages.expectedAfterSingleLine(), "CRLF")
  tr.notOk("a { color: pink;  top: 0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.expectedAfterSingleLine())
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a::before { content: \"; a\"; }")
  tr.ok("a { color: pink;top: 0; }", "space between trailing semicolon and closing brace")
  tr.ok("a,\nb { color: pink;top: 0; }", "multi-line rule, single-line declaration-block")

  // Ignore multi-line
  tr.ok("a {\n  color: pink; top: 0;\n}")
  tr.ok("a {\r\n  color: pink; top: 0;\r\n}", "CRLF")

  tr.notOk("a { color: pink; top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a,\nb { color: pink; top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a,\r\nb { color: pink; top: 0; }", messages.rejectedAfterSingleLine(), "CRLF")
  tr.notOk("a { color: pink;  top: 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { color: pink;\ttop: 0; }", messages.rejectedAfterSingleLine())
})

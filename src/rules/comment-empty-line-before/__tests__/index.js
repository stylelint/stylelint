import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("/** comment */", "first node ignored")
  tr.ok("a { color: pink; /** comment */\ntop: 0; }", "inline comment ignored")
  tr.ok("a {} /** comment */", "inline comment ignored")
  tr.ok("a {}\n\n/** comment */")
  tr.ok("a {}\r\n\r\n/** comment */", "CRLF")
  tr.ok("a { color: pink;\n\n/** comment */\ntop: 0; }")

  tr.notOk("/** comment */\n/** comment */", messages.expected)
  tr.notOk("/** comment */\r\n/** comment */", messages.expected, "CRLF")
  tr.notOk("a { color: pink;\n/** comment */\ntop: 0; }", messages.expected)
  tr.notOk("a { color: pink;\r\n/** comment */\r\ntop: 0; }", messages.expected, "CRLF")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\n/** comment */", "first node ignored")
  tr.ok("\r\n\r\n/** comment */", "first node ignored and CRLF")
  tr.ok("a { color: pink; /** comment */\ntop: 0; }", "inline comment ignored")
  tr.ok("a {} /** comment */")
  tr.ok("a { color: pink;\n/** comment */\n\ntop: 0; }")
  tr.ok("a { color: pink;\r\n/** comment */\r\n\r\ntop: 0; }", "CRLF")

  tr.notOk("/** comment */\n\n/** comment */", messages.rejected)
  tr.notOk("a {}\n\n\n/** comment */", messages.rejected)
  tr.notOk("a {}\r\n\r\n\r\n/** comment */", messages.rejected, "CRLF")
  tr.notOk("a { color: pink;\n\n/** comment */\ntop: 0; }", messages.rejected)
})

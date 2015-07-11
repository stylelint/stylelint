import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a {}", "first node ignored")
  tr.ok("@media { a {} }", "nested node ignored")
  tr.ok("b {}\n\na {}")
  tr.ok("b {}\r\n\r\na {}", "CRLF")
  tr.ok("b {}\n  \t\n\na {}")
  tr.ok("b {}\n\n\ta {}")
  tr.ok("b {}\r\n\r\n\ta {}", "CRLF")

  tr.notOk("b {} a {}", messages.expected)
  tr.notOk("b {}\na {}", messages.expected)
  tr.notOk("b {}\n\n/* comment here*/\na {}", messages.expected)
  tr.notOk("b {}\r\n\r\n/* comment here*/\r\na {}", messages.expected, "CRLF")
})

testRule("always", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\na {}")
  tr.ok("/* foo */\n\na {}")
  tr.ok("/* foo */\r\n\r\na {}", "CRLF")

  tr.notOk("b {} a {}", messages.expected)
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\na {}", "first node ignored")
  tr.ok("\r\n\r\na {}", "first node ignored and CRLF")
  tr.ok("@media {\n\na {} }", "nested node ignored")
  tr.ok("b {}\na {}")
  tr.ok("b {}\n  \t\na {}")
  tr.ok("b {}\r\n  \t\r\na {}", "CRLF")
  tr.ok("b {}\ta {}")

  tr.notOk("b {}\n\na {}", messages.rejected)
  tr.notOk("b {}\t\n\n\ta {}", messages.rejected)
  tr.notOk("b {}\t\r\n\r\n\ta {}", messages.rejected, "CRLF")
  tr.notOk("b {}\n\n/* comment here*/\n\na {}", messages.rejected)
})

testRule("never", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\na {}")
  tr.ok("/* foo */\r\na {}", "CRLF")
  tr.ok("/* foo */\n\na {}")

  tr.notOk("b {}\n\na {}", messages.rejected)
  tr.notOk("b {}\r\n\r\na {}", messages.rejected, "CRLF")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {}", "first node ignored")
  tr.ok("@media { a\n{} }", "nested node ignored")
  tr.ok("b {}\na {}", "single-line ignored")
  tr.ok("b\n{}\n\na\n{}")
  tr.ok("b\r\n{}\r\n\r\na\r\n{}", "CRLF")
  tr.ok("b\n{}\n  \t\n\na\n{}")
  tr.ok("b {}\n\n\ta\n{}")
  tr.ok("b {}\r\n\r\n\ta\r\n{}", "CRLF")

  tr.notOk("b {} a\n{}", messages.expected)
  tr.notOk("b\n{}\na\n{}", messages.expected)
  tr.notOk("b\r\n{}\r\na\r\n{}", messages.expected, "CRLF")
  tr.notOk("b {}\n\n/* comment here*/\na\n{}", messages.expected)
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\na\n{}", "first node ignored")
  tr.ok("@media\n{\n\na\n{} }", "nested node ignored")
  tr.ok("@media\r\n{\r\n\r\na\r\n{} }", "nested node ignored and CRLF")
  tr.ok("b {}\n\na {}", "single-line ignored")
  tr.ok("b\n{}\n  \t\na\n{}")
  tr.ok("b\r\n{}\r\n  \t\r\na\r\n{}", "CRLF")
  tr.ok("b {}\ta\n{}")

  tr.notOk("b {}\n\na\n{}", messages.rejected)
  tr.notOk("b {}\t\n\n\ta\n{}", messages.rejected)
  tr.notOk("b {}\t\r\n\r\n\ta\r\n{}", messages.rejected, "CRLF")
  tr.notOk("b {}\n\n/* comment here*/\n\na\n{}", messages.rejected)
  tr.notOk("b {}\r\n\r\n/* comment here*/\r\n\r\na\r\n{}", messages.rejected, "CRLF")
})

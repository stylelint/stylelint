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
  tr.ok("b {}\n  \t\n\na {}")
  tr.ok("b {}\n\n\ta {}")

  tr.notOk("b {} a {}", messages.expected)
  tr.notOk("b {}\na {}", messages.expected)
  tr.notOk("b {}\n\n/* comment here*/\na {}", messages.expected)
})

testRule("always", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\na {}")
  tr.ok("/* foo */\n\na {}")

  tr.notOk("b {} a {}", messages.expected)
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\na {}", "first node ignored")
  tr.ok("@media {\n\na {} }", "nested node ignored")
  tr.ok("b {}\na {}")
  tr.ok("b {}\n  \t\na {}")
  tr.ok("b {}\ta {}")

  tr.notOk("b {}\n\na {}", messages.rejected)
  tr.notOk("b {}\t\n\n\ta {}", messages.rejected)
  tr.notOk("b {}\n\n/* comment here*/\n\na {}", messages.rejected)
})

testRule("never", { ignore: ["after-comment"] }, tr => {
  tr.ok("/* foo */\na {}")
  tr.ok("/* foo */\n\na {}")

  tr.notOk("b {}\n\na {}", messages.rejected)
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {}", "first node ignored")
  tr.ok("@media { a\n{} }", "nested node ignored")
  tr.ok("b {}\na {}", "single-line ignored")
  tr.ok("b\n{}\n\na\n{}")
  tr.ok("b\n{}\n  \t\n\na\n{}")
  tr.ok("b {}\n\n\ta\n{}")

  tr.notOk("b {} a\n{}", messages.expected)
  tr.notOk("b\n{}\na\n{}", messages.expected)
  tr.notOk("b {}\n\n/* comment here*/\na\n{}", messages.expected)
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("\n\na\n{}", "first node ignored")
  tr.ok("@media\n{\n\na\n{} }", "nested node ignored")
  tr.ok("b {}\n\na {}", "single-line ignored")
  tr.ok("b\n{}\n  \t\na\n{}")
  tr.ok("b {}\ta\n{}")

  tr.notOk("b {}\n\na\n{}", messages.rejected)
  tr.notOk("b {}\t\n\n\ta\n{}", messages.rejected)
  tr.notOk("b {}\n\n/* comment here*/\n\na\n{}", messages.rejected)
})

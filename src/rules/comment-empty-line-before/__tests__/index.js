import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("/** comment */", "first node ignored")
  tr.ok("a {}\n\n/** comment */")
  tr.ok("a { color: pink;\n\n/** comment */\ntop: 0; }")

  tr.notOk("/** comment */\n/** comment */", messages.expected)
  tr.notOk("a {} /** comment */", messages.expected)
  tr.notOk("a { color: pink;\n/** comment */\ntop: 0; }", messages.expected)
})

testRule("always", { ignore: ["inline"] }, tr => {
  tr.ok("")
  tr.ok("/** comment */", "first node ignored")
  tr.ok("a {}\n\n/** comment */")
  tr.ok("a { color: pink; /** comment */\ntop: 0; }")

  tr.notOk("/** comment */\n/** comment */", messages.expected)
  tr.notOk("a {}\n/** comment */", messages.expected)
  tr.notOk("a { color: pink;\n/** comment */\ntop: 0; }", messages.expected)
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("\n\n/** comment */", "first node ignored")
  tr.ok("a {} /** comment */")
  tr.ok("a { color: pink;\n/** comment */\n\ntop: 0; }")

  tr.notOk("/** comment */\n\n/** comment */", messages.rejected)
  tr.notOk("a {}\n\n\n/** comment */", messages.rejected)
  tr.notOk("a { color: pink;\n\n/** comment */\ntop: 0; }", messages.rejected)
})

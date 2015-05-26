import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("\n")
  tr.ok("a { color: pink; }\n")
  tr.ok("a { color: pink; }\n\n\n")

  tr.notOk("", messages.expected)
  tr.notOk("a { color: pink; }", messages.expected)
  tr.notOk("a { color: pink; }\n\n\nb{ color: orange; }", messages.expected)
})

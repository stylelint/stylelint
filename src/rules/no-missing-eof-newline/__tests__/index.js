import {
  ruleTester
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  tr.ok("\n")
  tr.ok("a { color: pink; }\n")
  tr.ok("a { color: pink; }\n\n\n")

  tr.notOk("", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk("a { color: pink; }", {
    message: messages.rejected,
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: pink; }\n\n\nb{ color: orange; }", {
    message: messages.rejected,
    line: 4,
    column: 19,
  })
})

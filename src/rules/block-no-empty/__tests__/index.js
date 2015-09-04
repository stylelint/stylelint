import {
  ruleTester
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  // Stand-in warning-free-basics
  tr.ok("")
  tr.ok("@import \"foo.css\";")

  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("@import url(x.css)")

  tr.notOk("a {}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("a { }", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("a {\n}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("@media print {}", {
    message: messages.rejected,
    line: 1,
    column: 14,
  })
  tr.notOk("@media print { a {} }", {
    message: messages.rejected,
    line: 1,
    column: 18,
  })
})

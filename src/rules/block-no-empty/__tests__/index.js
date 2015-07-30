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

  tr.notOk("a {}", messages.rejected)
  tr.notOk("a { }", messages.rejected)
  tr.notOk("a {\n}", messages.rejected)
  tr.notOk("@media print {}", messages.rejected)
  tr.notOk("@media print { a {} }", messages.rejected)
})

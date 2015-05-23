import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: scale(1); }")
  tr.ok("a { -webkit-font-smoothing: antialiased; }", "non-standard property")

  tr.notOk("a { -webkit-transform: scale(1); }", messages.rejected("-webkit-transform"))
  tr.notOk(
    "a { -moz-columns: 2; columns: 2; }",
    messages.rejected("-moz-columns")
  )
  tr.notOk(
    "a { columns: 2; -o-columns: 2; }",
    messages.rejected("-o-columns")
  )
})

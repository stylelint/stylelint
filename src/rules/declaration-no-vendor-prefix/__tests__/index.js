import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
  tr.ok("a { transform: scale(1); }")
  tr.ok("a { -webkit-font-smoothing: antialiased; }", "non-standard property")
  tr.ok("a { -o-columns: 2; columns: 2; }", "fake prefix")

  tr.notOk("a { -webkit-transform: scale(1); transform: scale(1); }", messages.rejected("-webkit-transform"))
  tr.notOk("a { display: -webkit-box; display: flex; }", messages.rejected("-webkit-box"))
  tr.notOk("a { -moz-columns: 2; columns: 2; }", messages.rejected("-moz-columns"))
})

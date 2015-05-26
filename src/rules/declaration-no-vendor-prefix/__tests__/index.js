import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
  tr.ok(":root { --foo-bar: 1px; }")
  tr.ok("a { transform: scale(1); }", "property")
  tr.ok("a { box-sizing: border-box; }", "another property")
  tr.ok("a { display: flex; }", "value")
  tr.ok("a { -webkit-font-smoothing: antialiased; }", "non-standard prefixed property")

  tr.notOk("a { -webkit-transform: scale(1); }", messages.rejected("-webkit-transform"))
  tr.notOk("a { -webkit-transform: scale(1); transform: scale(1); }", messages.rejected("-webkit-transform"))
  tr.notOk("a { transform: scale(1); -webkit-transform: scale(1); }", messages.rejected("-webkit-transform"))
  tr.notOk("a { -moz-transition: all 3s; }", messages.rejected("-moz-transition"))
  tr.notOk("a { -moz-columns: 2; }", messages.rejected("-moz-columns"))

  tr.notOk("a { -o-columns: 2; }", messages.rejected("-o-columns"), "mistake prefix")

  tr.notOk("a { display: -webkit-flex; }", messages.rejected("-webkit-flex"), "non-hack prefixed value")
  tr.notOk("a { -ms-interpolation-mode: nearest-neighbor; }", messages.rejected("-ms-interpolation-mode"), "hack prefixed property")
})

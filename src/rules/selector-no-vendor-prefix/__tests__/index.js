import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(":fullscreen a {}")
  tr.notOk(":-webkit-full-screen a {}", messages.rejected(":-webkit-full-screen"))
  tr.notOk("body, :-ms-fullscreen a {}", messages.rejected(":-ms-fullscreen"))

  tr.ok("input::placeholder { color: pink; }")
  tr.notOk("input:-moz-placeholder, input::placeholder { color: pink; }",
    messages.rejected(":-moz-placeholder"))

  tr.ok("a::before {}", "handles pseudo-element")
  tr.ok("a:hover {}", "handles pseudo-class")
  tr.ok("a[data-foo=\":-webkit-full-screen\"] {}", "string")
})

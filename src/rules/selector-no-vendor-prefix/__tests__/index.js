import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(":fullscreen a {}")
  tr.notOk(":-webkit-full-screen a {}", {
    message: messages.rejected(":-webkit-full-screen"),
    line: 1,
    column: 1,
  })
  tr.notOk("body, :-ms-fullscreen a {}", {
    message: messages.rejected(":-ms-fullscreen"),
    line: 1,
    column: 7,
  })

  tr.ok("input::placeholder { color: pink; }")
  tr.notOk(
    "input:-moz-placeholder, input::placeholder { color: pink; }",
    {
      message: messages.rejected(":-moz-placeholder"),
      line: 1,
      column: 6,
    }
  )

  tr.ok("a::before {}", "handles pseudo-element")
  tr.ok("a:hover {}", "handles pseudo-class")
  tr.ok("a[data-foo=\":-webkit-full-screen\"] {}", "string")
})

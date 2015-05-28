import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}")
  tr.ok("a::before {}")
  tr.ok("a:hover {}")

  tr.ok(":fullscreen a {}")
  tr.notOk(":-webkit-full-screen a {}", messages.rejected(":-webkit-full-screen"))
  tr.notOk("body, :-ms-fullscreen a {}", messages.rejected(":-ms-fullscreen"))

  tr.ok("input::placeholder { color: pink; }")
  tr.notOk("input:-moz-placeholder, input::placeholder { color: pink; }",
    messages.rejected(":-moz-placeholder"))
})

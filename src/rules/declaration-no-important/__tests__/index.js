import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a {}", "no values")
  tr.ok("a { color: pink; }", "without !important")

  tr.notOk(
    "a { color: pink !important; }",
    messages.rejected,
    "with !important"
  )

  tr.notOk(
    "a { color: pink ! important; }",
    messages.rejected,
    "with ! important"
  )

  tr.notOk(
    "a { color: pink!important; }",
    messages.rejected,
    "with value!important"
  )
})

import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok(":root { --foo-bar: 1px; }")
  tr.ok("a { color: pink; }")
  tr.ok("a { -webkit-transform: 1px; }")

  tr.notOk("a { --foo-bar: 1px; }", messages.rejected)
  tr.notOk("a { color: pink; -webkit-transform: 1px; --foo-bar: 1px; }", messages.rejected)
  tr.notOk(":root, a { --foo-bar: 1px; }", messages.rejected)
  tr.notOk(":root a { --foo-bar: 1px; }", messages.rejected)
})

import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok(":root {}")
  tr.ok("   :root\n {}")

  tr.notOk("a, :root {}", messages.rejected)
  tr.notOk(":root, a {}", messages.rejected)
  tr.notOk(":root + a {}", messages.rejected)
  tr.notOk("body, .foo, :root + a {}", messages.rejected)
  tr.notOk("html:root {}", messages.rejected)
  tr.notOk("html :root {}", messages.rejected)
})

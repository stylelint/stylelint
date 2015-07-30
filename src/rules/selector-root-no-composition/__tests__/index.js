import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(":root {}")
  tr.ok("   :root\n {}")

  tr.notOk("a, :root {}", messages.rejected)
  tr.notOk(":root, a {}", messages.rejected)
  tr.notOk(":root + a {}", messages.rejected)
  tr.notOk("body, .foo, :root + a {}", messages.rejected)
  tr.notOk("html:root {}", messages.rejected)
  tr.notOk("html :root {}", messages.rejected)
})

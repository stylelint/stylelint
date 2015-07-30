import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("a {}")
  tr.ok(".foo, #bar {}")
  tr.ok("a.foo {}")

  tr.notOk("a b {}", messages.rejected)
  tr.notOk("a + a {}", messages.rejected)
  tr.notOk("a > a {}", messages.rejected)
  tr.notOk("a ~ a {}", messages.rejected)
  tr.notOk("a b, .foo {}", messages.rejected)
  tr.notOk("a#foo ~ b {}", messages.rejected)
})

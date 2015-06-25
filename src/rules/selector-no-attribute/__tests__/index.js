import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("foo {}")
  tr.ok(".bar {}")
  tr.ok("foo .bar {}")

  tr.notOk("[foo] {}", messages.rejected)
  tr.notOk("a[rel=\"external\"] {}", messages.rejected)
  tr.notOk("a, .foo[type=\"text\"] {}", messages.rejected)
  tr.notOk("a > [foo] {}", messages.rejected)
})

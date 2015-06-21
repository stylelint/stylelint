import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("foo {}")
  tr.ok("#foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.notOk("* {}", messages.rejected)
  tr.notOk(".bar * {}", messages.rejected)
  tr.notOk("*.bar {}", messages.rejected)
  tr.notOk(".foo, .bar, *.baz {}", messages.rejected)
})

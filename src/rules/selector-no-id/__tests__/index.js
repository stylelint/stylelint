import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  warningFreeBasics(tr)

  tr.ok("foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.notOk("#foo {}", messages.rejected)
  tr.notOk(".bar > #foo {}", messages.rejected)
  tr.notOk("#foo.bar {}", messages.rejected)
  tr.notOk(".foo, .bar, #foo.baz {}", messages.rejected)
})

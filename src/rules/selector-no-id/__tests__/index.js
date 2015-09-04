import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.notOk("#foo {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".bar > #foo {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk("#foo.bar {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".foo, .bar, #foo.baz {}", {
    message: messages.rejected,
    line: 1,
    column: 13,
  })
})

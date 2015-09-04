import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("foo {}")
  tr.ok("#foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.notOk("* {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".bar * {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk("*.bar {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".foo, .bar, *.baz {}", {
    message: messages.rejected,
    line: 1,
    column: 13,
  })
})

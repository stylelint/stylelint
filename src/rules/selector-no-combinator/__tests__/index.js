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

  tr.notOk("a b {}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  })
  tr.notOk("a + a {}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("a > a {}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("a ~ a {}", {
    message: messages.rejected,
    line: 1,
    column: 3,
  })
  tr.notOk("a b, .foo {}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  })
  tr.notOk(".foo, a b {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("\t.foo,\n\ta b {}", {
    message: messages.rejected,
    line: 2,
    column: 3,
  })
  tr.notOk("a#foo ~ b {}", {
    message: messages.rejected,
    line: 1,
    column: 7,
  })
})

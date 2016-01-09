import {
  ruleTester,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  // Stand-in warning-free-basics
  tr.ok("")
  tr.ok("@import \"foo.css\";")

  tr.ok("#foo {}")
  tr.ok(".foo {}")
  tr.ok("[foo] {}")

  tr.ok(".foo { & {} }")
  tr.ok(".foo { &.bar {} }")
  tr.ok(".foo { [&] {} }")
  tr.ok(".foo { & [class*=bar] {} }")
  tr.ok(".foo { @nest & {} }")
  tr.ok(".foo:nth-child(3n + 1) {}")
  tr.ok(".foo { &:nth-child(3n + 1) {} }")
  tr.ok("@keyframes spin { 0% {} }")
  tr.ok("@keyframes spin { to {} from {} }")

  tr.notOk("foo {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".bar > foo {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("foo.bar {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk(".foo, .bar, foo.baz {}", {
    message: messages.rejected,
    line: 1,
    column: 13,
  })
})

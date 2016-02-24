import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok("foo {}")
  tr.ok(".bar {}")
  tr.ok("foo .bar {}")
  tr.ok(":root { --custom-property-set: {} }")

  tr.notOk("[foo] {}", {
    message: messages.rejected,
    line: 1,
    column: 1,
  })
  tr.notOk("a[rel=\"external\"] {}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  })
  tr.notOk("a, .foo[type=\"text\"] {}", {
    message: messages.rejected,
    line: 1,
    column: 8,
  })
  tr.notOk("a > [foo] {}", {
    message: messages.rejected,
    line: 1,
    column: 5,
  })
  tr.notOk("a[rel='external'] {}", {
    message: messages.rejected,
    line: 1,
    column: 2,
  })
})

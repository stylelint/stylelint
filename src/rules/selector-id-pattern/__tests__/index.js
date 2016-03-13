import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

function basicAZTests(tr) {
  warningFreeBasics(tr)

  tr.ok("a {}")
  tr.ok(".foo {}")
  tr.ok("[foo='bar'] {}")
  tr.ok("#FOO {}")
  tr.ok("a .foo > [foo='bar'], #FOO {}")
  tr.ok("a /* #foo */ {}")
  tr.ok(":root { --custom-property-set: {} }")

  tr.notOk("a #foo {}", {
    message: messages.expected("foo"),
    line: 1,
    column: 3,
  })
  tr.notOk("#ABABA > #bar {}", {
    message: messages.expected("bar"),
    line: 1,
    column: 10,
  })
}

testRule(/^[A-Z]+$/, basicAZTests)
testRule("^[A-Z]+$", basicAZTests)

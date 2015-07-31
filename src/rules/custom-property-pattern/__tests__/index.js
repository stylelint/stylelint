import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(/foo-.+/, tr => {
  warningFreeBasics(tr)

  tr.ok(":root { --foo-bar: 0; }")
  tr.ok(":root { --boo-foo-bar: 0; }")
  tr.notOk(":root { --boo-bar: 0; }", messages.expected)
  tr.notOk(":root { --foo-: 0; }", messages.expected)
})

testRule(/^[A-Z][a-z]+-[a-z][a-zA-Z]+$/, tr => {
  warningFreeBasics(tr)

  tr.ok(":root { --Foo-bar: 0; }")
  tr.ok(":root { --Foo-barBaz: 0; }")
  tr.notOk(":root { --boo-Foo-bar: 0; }", messages.expected)
  tr.notOk(":root { --foo-bar: 0; }", messages.expected)
  tr.notOk(":root { --Foo-Bar: 0; }", messages.expected)
})

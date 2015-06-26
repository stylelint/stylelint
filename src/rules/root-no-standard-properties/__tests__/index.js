import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  warningFreeBasics(tr)

  tr.ok(":root { --foo: 0; }")
  tr.ok("a, :root { --foo: 0; }")
  tr.ok("a { color: pink; } :root { --foo: 0; }")

  tr.notOk(":root { top: 0; }", messages.rejected("top"))
  tr.notOk(":root { -webkit-transform: scale(0); }", messages.rejected("-webkit-transform"))
  tr.notOk("a, :root { color: pink; }", messages.rejected("color"))
  tr.notOk("a { color: pink; } :root { margin: 0; }", messages.rejected("margin"))
})

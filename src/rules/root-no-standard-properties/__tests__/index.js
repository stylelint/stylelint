import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(undefined, tr => {
  warningFreeBasics(tr)

  tr.ok(":root { --foo: 0; }")
  tr.ok("a, :root { --foo: 0; }")
  tr.ok("a { color: pink; } :root { --foo: 0; }")

  tr.notOk(":root { top: 0; }", {
    message: messages.rejected("top"),
    line: 1,
    column: 9,
  })
  tr.notOk(":root { -webkit-transform: scale(0); }", {
    message: messages.rejected("-webkit-transform"),
    line: 1,
    column: 9,
  })
  tr.notOk("a, :root { color: pink; }", {
    message: messages.rejected("color"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { color: pink; } :root { margin: 0; }", {
    message: messages.rejected("margin"),
    line: 1,
    column: 28,
  })
})

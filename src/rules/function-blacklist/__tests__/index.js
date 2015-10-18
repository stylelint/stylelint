import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "rgba",
  "scale",
  "linear-gradient"
], tr => {
  warningFreeBasics(tr)
  tr.ok("a { color: pink; }")

  tr.notOk("a { transform: scale(1); }", {
    message: messages.rejected("scale"),
    line: 1,
    column: 15,
  })
  tr.notOk("a { color: rgba(0, 0, 0, 0) }", {
    message: messages.rejected("rgba"),
    line: 1,
    column: 11,
  })
  tr.notOk("a { background: red, -moz-linear-gradient(45deg, blue, red); }", {
    message: messages.rejected("-moz-linear-gradient"),
    line: 1,
    column: 22,
  })
})

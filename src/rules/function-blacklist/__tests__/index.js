import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "rgba",
  "scale",
  "linear-gradient",
], tr => {
  warningFreeBasics(tr)
  tr.ok("a { color: pink; }")
  tr.ok("a { transform: rotate(7deg) }")
  tr.ok("a { background: -webkit-radial-gradient(red, green, blue); }")

  tr.notOk("a { transform: scale(1); }", {
    message: messages.rejected("scale"),
    line: 1,
    column: 16,
  })
  tr.notOk("a { transform : scale(1); }", {
    message: messages.rejected("scale"),
    line: 1,
    column: 17,
  })
  tr.notOk("a\n{ transform: scale(1); }", {
    message: messages.rejected("scale"),
    line: 2,
    column: 14,
  })
  tr.notOk("a { transform:    scale(1); }", {
    message: messages.rejected("scale"),
    line: 1,
    column: 19,
  })
  tr.notOk("  a { transform: scale(1); }", {
    message: messages.rejected("scale"),
    line: 1,
    column: 18,
  })
  tr.notOk("a { color: rgba(0, 0, 0, 0) }", {
    message: messages.rejected("rgba"),
    line: 1,
    column: 12,
  })
  tr.notOk("a { background: red, -moz-linear-gradient(45deg, blue, red); }", {
    message: messages.rejected("-moz-linear-gradient"),
    line: 1,
    column: 22,
  })
})

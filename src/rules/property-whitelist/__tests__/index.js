import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule([
  "transform",
  "background-size",
], tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: cover; }")
  tr.ok("a { transform: scale(1); }")
  tr.ok("a { -webkit-transform: scale(1); }")
  tr.ok("a { transform: scale(1); background-size: cover; }")
  tr.ok("a { transform: scale(1); -webkit-transform: scale(1); background-size: cover; }")

  tr.notOk("a { color: pink; }", {
    message: messages.rejected("color"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { overflow: hidden; background-size: cover; }", {
    message: messages.rejected("overflow"),
    line: 1,
    column: 5,
  })
  tr.notOk("a { color: orange; -webkit-transform: scale(1); }", {
    message: messages.rejected("color"),
    line: 1,
    column: 5,
  })

})

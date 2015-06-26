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

  tr.notOk("a { color: pink; }", messages.rejected("color"))
  tr.notOk("a { overflow: hidden; background-size: cover; }", messages.rejected("overflow"))
  tr.notOk("a { color: orange; -webkit-transform: scale(1); }", messages.rejected("color"))

})

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

  tr.ok("a { color: pink; }")
  tr.ok("a { background: red; }")
  tr.ok("a { top: 0; color: pink; }")

  tr.notOk("a { transform: scale(1); }", messages.rejected("transform"))
  tr.notOk("a { color: pink; background-size: cover; }", messages.rejected("background-size"))
  tr.notOk("a { color: pink; -webkit-transform: scale(1); }", messages.rejected("-webkit-transform"))
})

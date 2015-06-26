import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }")
  tr.ok("a { color: pink; background: orange; }")

  tr.notOk("a { color: pink; color: orange }", messages.rejected("color"))
  tr.notOk("a { color: pink; background: orange; color: orange }", messages.rejected("color"))
  tr.notOk("a { color: pink; background: orange; background: pink; }", messages.rejected("background"))
})

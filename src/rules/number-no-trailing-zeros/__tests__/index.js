import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule(null, tr => {
  tr.ok("a { padding: 1px; }")
  tr.ok("a { padding: 10px; }")
  tr.ok("a { padding: 10.01px; }")
  tr.ok("a { padding: 10px 1px 1.05px 3.00003em; }")
  tr.ok("a { padding: 0.01px; }")
  tr.ok("a { padding: .01px; }")

  tr.notOk("a { padding: 1.0px; }", messages.rejected)
  tr.notOk("a { padding: 1.000px; }", messages.rejected)
  tr.notOk("a { padding: 10.0px; }", messages.rejected)
  tr.notOk("a { padding: 10.010px; }", messages.rejected)
  tr.notOk("a { padding: 10.010px; }", messages.rejected)
  tr.notOk("a { padding: 0.010px; }", messages.rejected)
  tr.notOk("a { padding: .010px; }", messages.rejected)
  tr.notOk("a { transform: translate(2px, 0.40px); }", messages.rejected)
  tr.notOk("a { padding: 10px 1px 10.010px 3.00003em; }", messages.rejected)
  tr.notOk("a { padding: 10px 1px 10.01px 3.000030em; }", messages.rejected)
})

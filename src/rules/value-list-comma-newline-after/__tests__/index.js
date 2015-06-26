import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0,\n0; }")
  tr.ok("a { background-size: 0 ,\n  0; }")
  tr.notOk("a { background-size: 0, 0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfter())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "string")
  tr.ok("a { transform: translate(1,1); }", "ignores function")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0,\n0,\n0; }")
  tr.ok("a { background-size: 0 ,\n  0,\n0; }")
  tr.notOk("a { background-size: 0,\n0, 0; }", messages.expectedAfterMultiLine())
  tr.notOk("a { background-size: 0,\n0,  0; }", messages.expectedAfterMultiLine())
  tr.notOk("a { background-size: 0,\n0,\t0; }", messages.expectedAfterMultiLine())

  tr.ok("a { background-size: 0, 0; }", "ignores single-line")
  tr.ok("a { background-size: 0, 0;\n}", "ignores single-line list, multi-line block")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0\n,0\n,0; }")
  tr.notOk("a { background-size: 0\n,0\n, 0; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { background-size: 0\n,0\n,  0; }", messages.rejectedAfterMultiLine())
  tr.notOk("a { background-size: 0\n,0\n,\t0; }", messages.rejectedAfterMultiLine())

  tr.ok("a { background-size: 0, 0; }", "ignores single-line")
  tr.ok("a { background-size: 0, 0;\n}", "ignores single-line list, multi-line block")
})

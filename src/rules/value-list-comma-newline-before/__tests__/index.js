import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0\n,0\n,0; }")
  tr.ok("a { background-size: 0\n,  0\n,\t0; }")
  tr.ok("a { background-size: 0\n    ,0\n,0; }", "indentation after the newline before the comma")
  tr.ok("a { background-size: 0\n\t\t,0\n,0; }", "indentation after the newline before the comma")
  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0 , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "string")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0\n,0\n,0; }")
  tr.ok("a { background-size: 0\n,  0\n,\t0; }")

  tr.notOk("a { background-size: 0\n, 0, 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n, 0 , 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n, 0\t, 0; }", messages.expectedBeforeMultiLine())

  tr.ok("a { background-size: 0, 0; }", "ignores single-line")
  tr.ok("a { background-size: 0, 0;\n}", "ignores single-line list, multi-line block")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0,\n0,\n0; }")
  tr.notOk("a { background-size: 0,\n0\n, 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n,\t0,\n0; }", messages.rejectedBeforeMultiLine())

  tr.ok("a { background-size: 0 ,0; }", "ignores single-line")
  tr.ok("a { background-size: 0 ,0;\n}", "ignores single-line list, multi-line block")
})

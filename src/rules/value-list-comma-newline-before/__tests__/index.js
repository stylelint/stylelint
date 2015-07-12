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
  tr.ok("a { background-size: 0\r\n,  0\r\n,\t0; }", "CRLF")
  tr.ok("a { background-size: 0\n    ,0\n,0; }", "indentation after the newline before the comma")
  tr.ok("a { background-size: 0\n\t\t,0\n,0; }", "indentation after the newline before the comma")
  tr.ok("a { background-size: 0\r\n\t\t,0\r\n,0; }", "indentation after the CRLF before the comma")
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
  tr.ok("a { background-size: 0\r\n,  0\r\n,\t0; }", "CRLF")

  tr.notOk("a { background-size: 0\n, 0, 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n, 0 , 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\r\n, 0 , 0; }", messages.expectedBeforeMultiLine(), "CRLF")
  tr.notOk("a { background-size: 0\n, 0\t, 0; }", messages.expectedBeforeMultiLine())

  tr.ok("a { background-size: 0, 0; }", "ignores single-line")
  tr.ok("a { background-size: 0, 0;\n}", "ignores single-line list, multi-line block")
  tr.ok("a { background-size: 0, 0;\r\n}", "ignores single-line list, multi-line block with CRLF")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0,\n0,\n0; }")
  tr.notOk("a { background-size: 0,\n0\n, 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { background-size: 0,\r\n0\r\n, 0; }", messages.rejectedBeforeMultiLine(), "CRLF")
  tr.notOk("a { background-size: 0\n,\t0,\n0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\r\n,\t0,\r\n0; }", messages.rejectedBeforeMultiLine(), "CRLF")

  tr.ok("a { background-size: 0 ,0; }", "ignores single-line")
  tr.ok("a { background-size: 0 ,0;\n}", "ignores single-line list, multi-line block")
})

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\r\n, 0; }", messages.expectedBefore(), "CRLF")
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\r\n, 0; }", messages.rejectedBefore(), "CRLF")
  tr.notOk("a { background-size: 0\t, 0; }", messages.rejectedBefore())

  tr.ok("a::before { content: \"foo ,bar ,baz\"; }", "strings")
  tr.ok("a { transform: translate(1 ,1); }", "function arguments")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0 ,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0 ,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0,\n0; }", "ignores multi-line list")
  tr.ok("a { background-size: 0,\r\n0; }", "ignores multi-line list with CRLF")

  tr.notOk("a { background-size: 0, 0; }", messages.expectedBeforeSingleLine())
  tr.notOk("a { background-size: 0, 0;\n}", messages.expectedBeforeSingleLine())
  tr.notOk("a { background-size: 0, 0;\r\n}", messages.expectedBeforeSingleLine(), "CRLF")
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBeforeSingleLine())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBeforeSingleLine())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.ok("a { background-size: 0,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0 ,\n0; }", "ignores multi-line list")
  tr.ok("a { background-size: 0 ,\r\n0; }", "ignores multi-line list with CRLF")

  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { background-size: 0 , 0;\n}", messages.rejectedBeforeSingleLine())
  tr.notOk("a { background-size: 0 , 0;\r\n}", messages.rejectedBeforeSingleLine(), "CRLF")
  tr.notOk("a { background-size: 0  , 0; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { background-size: 0\t, 0; }", messages.rejectedBeforeSingleLine())

  tr.ok("a::before { content: \"foo ,bar ,baz\"; }", "strings")
  tr.ok("a { transform: translate(1 ,1); }", "function arguments")
})

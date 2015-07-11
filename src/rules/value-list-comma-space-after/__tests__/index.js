import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")
  tr.notOk("a { background-size: 0,0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\r\n0; }", messages.expectedAfter(), "CRLF")
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfter())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\r\n0; }", messages.rejectedAfter(), "CRLF")
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfter())

  tr.ok("a::before { content: \"foo, bar, baz\"; }", "strings")
  tr.ok("a { transform: translate(1, 1); }", "function arguments")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0, 0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0, 0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0\n,0}", "ignores multi-line")
  tr.ok("a { background-size: 0\r\n,0}", "ignores multi-line with CRLF")

  tr.notOk("a { background-size: 0,0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { background-size: 0,0;\n}", messages.expectedAfterSingleLine())
  tr.notOk("a { background-size: 0,0;\r\n}", messages.expectedAfterSingleLine(), "CRLF")
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfterSingleLine())

  tr.ok("a::before { content: \"foo,bar,baz\"; }", "strings")
  tr.ok("a { transform: translate(1,1); }", "function arguments")
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.ok("a { background-size: 0,0;\n}", "single-line list, multi-line block")
  tr.ok("a { background-size: 0,0;\r\n}", "single-line list, multi-line block with CRLF")
  tr.ok("a { background-size: 0\n,  0}", "ignores multi-line values")
  tr.ok("a { background-size: 0\r\n,  0}", "ignores multi-line values with CRLF")

  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { background-size: 0, 0;\n}", messages.rejectedAfterSingleLine())
  tr.notOk("a { background-size: 0, 0;\r\n}", messages.rejectedAfterSingleLine(), "CRLF")
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfterSingleLine())

  tr.ok("a::before { content: \"foo, bar, baz\"; }", "strings")
  tr.ok("a { transform: translate(1, 1); }", "function arguments")
})

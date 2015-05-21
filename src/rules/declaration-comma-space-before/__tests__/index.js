import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"foo,bar,baz\"; }")
  tr.ok("a::before { content: attr(data-foo,\"baz\"); }")
  tr.ok("a::before { background: url('foo,bar,baz'); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0 ,0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"foo ,bar ,baz\"; }")
  tr.ok("a::before { content: attr(data-foo ,\"baz\"); }")
  tr.ok("a::before { background: url('foo ,bar ,baz'); }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0,0; }")

  tr.notOk("a { background-size: 0 , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\n, 0; }", messages.rejectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.rejectedBefore())
})

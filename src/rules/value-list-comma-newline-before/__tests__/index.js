import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a::before { content: \"foo,bar,baz\"; }")
  tr.ok("a::before { content: attr(data-foo,\"baz\"); }")
  tr.ok("a::before { background: url('foo,bar,baz'); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0\n,0\n,0; }")
  tr.ok("a { background-size: 0\n,  0\n,\t0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0 , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0  , 0; }", messages.expectedBefore())
  tr.notOk("a { background-size: 0\t, 0; }", messages.expectedBefore())
})

testRule("always-multi-line", tr => {
  tr.ok("a { background-size: 0\n,0\n,0; }")
  tr.ok("a { background-size: 0\n,  0\n,\t0; }")
  tr.ok("a { background-size: 0, 0; }", "ignores single-line")

  tr.notOk("a { background-size: 0\n, 0, 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n, 0 , 0; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n, 0\t, 0; }", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("a { background-size: 0,\n0,\n0; }")
  tr.ok("a { background-size: 0, 0; }", "ignores single-line")

  tr.notOk("a { background-size: 0,\n0\n, 0; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a { background-size: 0\n,\t0,\n0; }", messages.rejectedBeforeMultiLine())
})

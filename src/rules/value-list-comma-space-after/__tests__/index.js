import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"foo,bar,baz\"; }")
  tr.ok("a::before { content: attr(data-foo,\"baz\"); }")
  tr.ok("a::before { background: url('foo,bar,baz'); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")

  tr.notOk("a { background-size: 0,0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.expectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"foo, bar, baz\"; }")
  tr.ok("a::before { content: attr(data-foo, \"baz\"); }")
  tr.ok("a::before { background: url('foo, bar, baz'); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")

  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\n0; }", messages.rejectedAfter())
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfter())
})

testRule("always-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"foo,bar,baz\"; }")
  tr.ok("a::before { content: attr(data-foo,\"baz\"); }")
  tr.ok("a::before { background: url('foo,bar,baz'); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { background-size: 0 , 0; }")
  tr.ok("a { background-size: 0, 0; }")
  tr.ok("a { background-size: 0\n,0}", "ignores multi-line")

  tr.notOk("a { background-size: 0,0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { background-size: 0,  0; }", messages.expectedAfterSingleLine())
  tr.notOk("a { background-size: 0,\t0; }", messages.expectedAfterSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"foo, bar, baz\"; }")
  tr.ok("a::before { content: attr(data-foo, \"baz\"); }")
  tr.ok("a::before { background: url('foo, bar, baz'); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { background-size: 0 ,0; }")
  tr.ok("a { background-size: 0,0; }")
  tr.ok("a { background-size: 0\n,  0}", "ignores multi-line")

  tr.notOk("a { background-size: 0, 0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { background-size: 0,  0; }", messages.rejectedAfterSingleLine())
  tr.notOk("a { background-size: 0,\t0; }", messages.rejectedAfterSingleLine())
})

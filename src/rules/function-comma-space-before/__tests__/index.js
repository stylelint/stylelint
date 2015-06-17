import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"func(foo,bar,baz)\"; }")
  tr.ok("a::before { background: url('func(foo,bar,baz)'); }")
  tr.ok("a { background-size: 0, 0, 0; }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.expectedBefore())
  tr.notOk("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }", messages.expectedBefore())
  tr.notOk("a { transform: color(lightness(50%) rgb(0 , 0, 0)); }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a::before { content: \"func(foo ,bar ,baz)\"; }")
  tr.ok("a::before { background: url('func(foo ,bar ,baz)'); }")
  tr.ok("a { background-size: 0 , 0 , 0; }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0, 0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1 , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1  , 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\n, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: translate(1\t, 1); }", messages.rejectedBefore())
  tr.notOk("a { transform: color(rgb(0, 0 , 0) lightness(50%)); }", messages.rejectedBefore())
  tr.notOk("a { transform: color(lightness(50%) rgb(0, 0 , 0)); }", messages.rejectedBefore())
})

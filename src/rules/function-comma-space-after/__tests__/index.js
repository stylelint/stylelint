import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a { background-size: 0,0,0; }")
  tr.ok("a { transform: translate(1 , 1); }")
  tr.ok("a { transform: translate(1, 1); }")
  tr.ok("a { transform: color(rgb(0 , 0, 0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1,1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.expectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.expectedAfter())
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a { background-size: 0, 0, 0; }")
  tr.ok("a { transform: translate(1 ,1); }")
  tr.ok("a { transform: translate(1,1); }")
  tr.ok("a { transform: color(rgb(0 ,0,0) lightness(50%)); }")

  tr.notOk("a { transform: translate(1, 1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,  1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\n1); }", messages.rejectedAfter())
  tr.notOk("a { transform: translate(1,\t1); }", messages.rejectedAfter())
  tr.notOk("a { transform: color(rgb(0 , 0 ,0) lightness(50%)); }", messages.rejectedAfter())
})

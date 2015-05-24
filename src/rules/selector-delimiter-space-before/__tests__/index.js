import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a ,b {}")
  tr.ok("a ,b ,c {}")
  tr.ok("a , b {}")
  tr.ok("a ,\nb {}")
  tr.ok("a ,b[data-foo=\"tr,tr\"] {}")

  tr.notOk("a,b {}", messages.expectedBefore())
  tr.notOk("a  ,b {}", messages.expectedBefore())
  tr.notOk("a\n,b {}", messages.expectedBefore())
  tr.notOk("a\t,b {}", messages.expectedBefore())
  tr.notOk("a ,b,c {}", messages.expectedBefore())
  tr.notOk("a ,b  ,c {}", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a {}")
  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a, b {}")
  tr.ok("a,\nb {}")
  tr.ok("a,b[data-foo=\"tr ,tr\"] {}")

  tr.notOk("a ,b {}", messages.rejectedBefore())
  tr.notOk("a  ,b {}", messages.rejectedBefore())
  tr.notOk("a\n,b {}", messages.rejectedBefore())
  tr.notOk("a\t,b {}", messages.rejectedBefore())
  tr.notOk("a,b ,c {}", messages.rejectedBefore())
  tr.notOk("a,b  ,c {}", messages.rejectedBefore())
})

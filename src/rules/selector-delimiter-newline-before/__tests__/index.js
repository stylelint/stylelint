import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a\n,b {}")
  tr.ok("a\n,b\n,c {}")
  tr.ok("a\n, b {}")
  tr.ok("a\n,\nb {}")
  tr.ok("a\n,b[data-foo=\"tr,tr\"] {}")

  tr.notOk("a,b {}", messages.expectedBefore())
  tr.notOk("a ,b {}", messages.expectedBefore())
  tr.notOk("a  ,b {}", messages.expectedBefore())
  tr.notOk("a\t,b {}", messages.expectedBefore())
  tr.notOk("a\n,b,c {}", messages.expectedBefore())
  tr.notOk("a\n,b\n ,c {}", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a, b {}")
  tr.ok("a,\nb {}")
  tr.ok("a,b[data-foo=\"tr ,tr\"] {}")

  tr.notOk("a ,b {}", messages.rejectedBefore())
  tr.notOk("a  ,b {}", messages.rejectedBefore())
  tr.notOk("a\t,b {}", messages.rejectedBefore())
  tr.notOk("a,b ,c {}", messages.rejectedBefore())
  tr.notOk("a,b\n ,c {}", messages.rejectedBefore())
})

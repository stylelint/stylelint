import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a,\nb {}")
  tr.ok("a,\nb,\nc {}")
  tr.ok("a ,\nb {}")
  tr.ok("a\n,\nb {}")
  tr.ok("a,\nb[data-foo=\"tr,tr\"] {}")

  tr.notOk("a,b {}", messages.expectedAfter())
  tr.notOk("a, b {}", messages.expectedAfter())
  tr.notOk("a,  b {}", messages.expectedAfter())
  tr.notOk("a,\tb {}", messages.expectedAfter())
  tr.notOk("a,\nb,c {}", messages.expectedAfter())
  tr.notOk("a,\nb,\n c {}", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a ,b {}")
  tr.ok("a\n,b {}")
  tr.ok("a,b[data-foo=\"tr, tr\"] {}")

  tr.notOk("a, b {}", messages.rejectedAfter())
  tr.notOk("a,  b {}", messages.rejectedAfter())
  tr.notOk("a,\nb {}", messages.rejectedAfter())
  tr.notOk("a,\tb {}", messages.rejectedAfter())
  tr.notOk("a,b, c {}", messages.rejectedAfter())
  tr.notOk("a,b,\n c {}", messages.rejectedAfter())
})

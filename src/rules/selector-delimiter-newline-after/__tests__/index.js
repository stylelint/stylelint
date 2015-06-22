import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a {}")
  tr.ok("a,\nb {}")
  tr.ok("a,\nb,\nc {}")
  tr.ok("a ,\nb {}")
  tr.ok("a\n,\nb {}")
  tr.ok("a,\nb[data-foo=\"tr,tr\"] {}")
  tr.ok("a {\n  &:hover,\n  &:focus {\n    color: pink; }\n}", "nested in rule set")
  tr.ok("@media (min-width: 10px) {\n  a,\n  b {}\n}", "nested in at-rule")

  tr.notOk("a,b {}", messages.expectedAfter())
  tr.notOk("a, b {}", messages.expectedAfter())
  tr.notOk("a,  b {}", messages.expectedAfter())
  tr.notOk("a,\tb {}", messages.expectedAfter())
  tr.notOk("a,\nb,c {}", messages.expectedAfter())
  tr.notOk("a,\nb,\n c {}", messages.expectedAfter())
  tr.notOk("a,\n  b {}", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("a {}")
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

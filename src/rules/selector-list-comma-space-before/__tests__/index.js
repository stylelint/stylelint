import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a ,b {}")
  tr.ok("a ,b ,c {}")
  tr.ok("a , b {}")
  tr.ok("a ,\nb {}")

  tr.notOk("a,b {}", messages.expectedBefore())
  tr.notOk("a  ,b {}", messages.expectedBefore())
  tr.notOk("a\n,b {}", messages.expectedBefore())
  tr.notOk("a\t,b {}", messages.expectedBefore())
  tr.notOk("a ,b,c {}", messages.expectedBefore())
  tr.notOk("a ,b  ,c {}", messages.expectedBefore())

  tr.ok("a ,b[data-foo=\"tr,tr\"] {}", "string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b,c {}")
  tr.ok("a, b {}")
  tr.ok("a,\nb {}")

  tr.notOk("a ,b {}", messages.rejectedBefore())
  tr.notOk("a  ,b {}", messages.rejectedBefore())
  tr.notOk("a\n,b {}", messages.rejectedBefore())
  tr.notOk("a\t,b {}", messages.rejectedBefore())
  tr.notOk("a,b ,c {}", messages.rejectedBefore())
  tr.notOk("a,b  ,c {}", messages.rejectedBefore())

  tr.ok("a,b[data-foo=\"tr ,tr\"] {}", "string")
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a ,b {}")
  tr.ok("a ,b {\n}", "single-line selector list, multi-line block")

  tr.notOk("a,b {}", messages.expectedBeforeSingleLine())
  tr.notOk("a,b {\n}", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,b {}")
  tr.ok("a,b {\n}", "single-line selector list, multi-line block")

  tr.notOk("a ,b {}", messages.rejectedBeforeSingleLine())
  tr.notOk("a ,b {\n}", messages.rejectedBeforeSingleLine())
})

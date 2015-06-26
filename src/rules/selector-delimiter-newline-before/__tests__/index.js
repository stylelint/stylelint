import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

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

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector, multi-line block")

  tr.notOk("a\n,b, c {}", messages.expectedBeforeMultiLine())
  tr.notOk("a\n,b, c {\n}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector, multi-line block")

  tr.notOk("a,\nb , c {}", messages.rejectedBeforeMultiLine())
  tr.notOk("a,\nb , c {\n}", messages.rejectedBeforeMultiLine())
})

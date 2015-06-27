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
  tr.ok("a\n    ,b {}", "indentation after the newline before the comma")
  tr.ok("a\n\t\t,b {}", "indentation after the newline before the comma")

  tr.notOk("a,b {}", messages.expectedBefore())
  tr.notOk("a ,b {}", messages.expectedBefore())
  tr.notOk("a  ,b {}", messages.expectedBefore())
  tr.notOk("a\t,b {}", messages.expectedBefore())
  tr.notOk("a\n,b,c {}", messages.expectedBefore())
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a\n,b, c {}", messages.expectedBeforeMultiLine())
  tr.notOk("a\n,b, c {\n}", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a,\nb , c {}", messages.rejectedBeforeMultiLine())
  tr.notOk("a,\nb , c {\n}", messages.rejectedBeforeMultiLine())
})

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

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

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a,\nb {}")
  tr.ok("a, b {}", "ignores single-line")
  tr.ok("a, b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a,\nb, c {}", messages.expectedAfterMultiLine())
  tr.notOk("a,\nb, c {\n}", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a\n,b {}")
  tr.ok("a ,b {}", "ignores single-line")
  tr.ok("a ,b {\n}", "ignores single-line selector list, multi-line block")

  tr.notOk("a,\nb ,c {}", messages.rejectedAfterMultiLine())
  tr.notOk("a,\nb ,c {\n}", messages.rejectedAfterMultiLine())
})

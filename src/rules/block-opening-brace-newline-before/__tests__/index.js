import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("a\n{ color: pink; }")
  tr.ok("a\n{color: pink; }")
  tr.ok("@media print\n{ a\n{ color: pink; } }")
  tr.ok("@media print\n{a\n{color: pink; } }")

  tr.notOk("a { color: pink; }", messages.expectedBefore())
  tr.notOk("a{ color: pink; }", messages.expectedBefore())
  tr.notOk("a  { color: pink; }", messages.expectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.expectedBefore())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print{ a\n{ color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print\n{ a{ color: pink; } }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("a{ color: pink; }")
  tr.ok("a{color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")
  tr.ok("@media print{a{color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.rejectedBefore())
  tr.notOk("a  { color: pink; }", messages.rejectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.rejectedBefore())
  tr.notOk("@media print\n{ a{ color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{ a\n{ color: pink; } }", messages.rejectedBefore())
})

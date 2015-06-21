import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("@import url(x.css)")
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
  tr.notOk("a\n/* foo */{ a{ color: pink; } }", messages.expectedBefore())
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

testRule("always-single-line", tr => {
  tr.ok("a\n{ color: pink; }")
  tr.ok("a\n{color: pink; }")
  tr.ok("@media print\n{ a\n{ color: pink; } }")
  tr.ok("@media print\n{a\n{color: pink; } }")

  // Ignoring multi-line blocks
  tr.ok("a{ color: pink;\nbackground:orange; }")
  tr.ok("@media print { a{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{ a { color: pink;\nbackground:orange; } }")
  tr.ok("@media print{\na\n{ color: pink; } }")

  tr.notOk("a { color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a{ color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a  { color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a\t{ color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBeforeSingleLine())
  tr.notOk("@media print\n{ a{ color: pink; } }", messages.expectedBeforeSingleLine())
})

testRule("never-single-line", tr => {
  tr.ok("a{ color: pink; }")
  tr.ok("a{color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")
  tr.ok("@media print{a{color: pink; } }")

  // Ignoring multi-line blocks
  tr.ok("a\n{ color: pink;\nbackground:orange; }")
  tr.ok("@media print { a\n{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{ a\n{ color: pink;\nbackground:orange; } }")
  tr.ok("@media print{\na{ color: pink; } }")

  tr.notOk("a\n{ color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a  { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a\t{ color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("@media print\n{ a\n{ color: pink; } }", messages.rejectedBeforeSingleLine())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.rejectedBeforeSingleLine())
})

testRule("always-multi-line", tr => {
  tr.ok("a\n{ color: pink;\nbackground: orange; }")
  tr.ok("@media print\n{\na\n{ color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a{ color: pink; }")
  tr.ok("a  { color: pink; }")
  tr.ok("a\t{ color: pink; }")

  tr.notOk("a{ color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a  { color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a\t{ color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a { color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("@media print\n{\na { color: pink;\nbackground: orange; } }", messages.expectedBeforeMultiLine())
  tr.notOk("@media print { a\n{ color: pink;\nbackground: orange; } }", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("a{ color: pink;\nbackground: orange; }")
  tr.ok("@media print{\na{ color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a{ color: pink; }")
  tr.ok("a  { color: pink; }")
  tr.ok("a\t{ color: pink; }")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a  { color: pink;\nbackground: orange; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a\t{ color: pink;\nbackground: orange; }", messages.rejectedBeforeMultiLine())
  tr.notOk("a\n{ color: pink;\nbackground: orange; }", messages.rejectedBeforeMultiLine())
  tr.notOk("@media print\n{\na{ color: pink;\nbackground: orange; } }", messages.rejectedBeforeMultiLine())
  tr.notOk("@media print{ a\n{ color: pink;\nbackground: orange; } }", messages.rejectedBeforeMultiLine())
})

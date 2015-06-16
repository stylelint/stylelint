import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", messages.expectedBefore())
  tr.notOk("a  { color: pink; }", messages.expectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.expectedBefore())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.expectedBefore())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a  { color: pink; }", messages.rejectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.rejectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.rejectedBefore())
  tr.notOk("@media print { a{ color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{ a { color: pink; } }", messages.rejectedBefore())
})

testRule("always-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  // Regular "always" tests
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a  { color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a\t{ color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("a\n{ color: pink; }", messages.expectedBeforeSingleLine())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBeforeSingleLine())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.expectedBeforeSingleLine())

  // Ignoring multi-line blocks
  tr.ok("a{ color:\npink; }")
  tr.ok("@media print { a{ color:\npink; } }")
  tr.ok("@media print{ a { color:\npink; } }")
  tr.ok("@media print{\na { color: pink; } }")
})

testRule("never-single-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  // Regular "never" tests
  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a  { color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a\t{ color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("a\n{ color: pink; }", messages.rejectedBeforeSingleLine())
  tr.notOk("@media print { a{ color: pink; } }", messages.rejectedBeforeSingleLine())
  tr.notOk("@media print{ a { color: pink; } }", messages.rejectedBeforeSingleLine())

  // Ignoring multi-line blocks
  tr.ok("a { color:\npink; }")
  tr.ok("@media print { a { color:\npink; } }")
  tr.ok("@media print{ a{ color:\npink; } }")
  tr.ok("@media print {\na{ color: pink; } }")
  tr.ok("@media print{\na{ color: pink; } }")
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("@media print {\na { color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a{ color: pink; }")
  tr.ok("a  { color: pink; }")
  tr.ok("a\t{ color: pink; }")

  tr.notOk("a{ color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a  { color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a\t{ color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("a\n{ color: pink;\nbackground: orange; }", messages.expectedBeforeMultiLine())
  tr.notOk("@media print\n{\na { color: pink;\nbackground: orange; } }", messages.expectedBeforeMultiLine())
  tr.notOk("@media print { a\n{ color: pink;\nbackground: orange; } }", messages.expectedBeforeMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
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

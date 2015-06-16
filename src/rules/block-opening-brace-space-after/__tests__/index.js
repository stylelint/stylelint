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

  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {  color: pink; }", messages.expectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedAfter())
  tr.notOk("a {  color: pink; }", messages.rejectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.rejectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("@media print {\na {color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a {\ncolor: pink; } }", messages.rejectedAfter())
})

testRule("always-single-line", tr => {
  tr.ok("")
  // Regular "always" tests
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a {color: pink; }", messages.expectedAfterSingleLine())
  tr.notOk("a {  color: pink; }", messages.expectedAfterSingleLine())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfterSingleLine())
  tr.notOk("@media print {\ta { color: pink; } }", messages.expectedAfterSingleLine())
  tr.notOk("@media print { a {\tcolor: pink; } }", messages.expectedAfterSingleLine())

  // Ignoring multi-line blocks
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {color:\npink; }")
  tr.ok("@media print {a {color:\npink; } }")
  tr.ok("@media print{a {color:\npink; } }")
})

testRule("never-single-line", tr => {
  tr.ok("")
  // Regular "never" tests
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedAfterSingleLine())
  tr.notOk("a {  color: pink; }", messages.rejectedAfterSingleLine())
  tr.notOk("a {\tcolor: pink; }", messages.rejectedAfterSingleLine())
  tr.notOk("@media print { a {color: pink; } }", messages.rejectedAfterSingleLine())
  tr.notOk("@media print {a { color: pink; } }", messages.rejectedAfterSingleLine())

  // Ignoring multi-line blocks
  tr.ok("a { color:\npink; }")
  tr.ok("@media print { a { color:\npink; } }")
  tr.ok("@media print { a\n{color: pink; } }")
})

testRule("always-multi-line", tr => {
  tr.ok("")
  tr.ok("a { color: pink;\nbackground: orange; }")
  tr.ok("@media print { a { color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")

  tr.notOk("a {color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("@media print\n{a { color: pink;\nbackground: orange; } }", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a\n{color: pink;\nbackground: orange; } }", messages.expectedAfterMultiLine())
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {color: pink;\nbackground: orange; }")
  tr.ok("@media print {a\n{color: pink;\nbackground: orange } }")

  // Ignoring single-line blocks
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print\n{ a {color: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print{a\n{ color: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
})

import { ruleTester } from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")

  tr.notOk("a { color: pink; }", messages.expectedAfter())
  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {  color: pink; }", messages.expectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
})

testRule("never", tr => {
  tr.ok("")
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {color: pink; }")
  tr.ok("a{color: pink; }")
  tr.ok("@media print {a {color: pink; } }")
  tr.ok("@media print{a{color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("a {  color: pink; }", messages.rejectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.rejectedAfter())
  tr.notOk("@media print {\na {color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a {\ncolor: pink; } }", messages.rejectedAfter())
})

testRule("always-multi-line", tr => {
  tr.ok("")
  // Regular "always" tests
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\n  color: pink;\n  background: orange; }")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("@media print { a {\ncolor:\npink; } }", messages.expectedAfterMultiLine())
  tr.notOk("@media print {\na { color:\npink; } }", messages.expectedAfterMultiLine())

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("a {  color: pink;  background: orange; }")
})

testRule("never-multi-line", tr => {
  tr.ok("")
  tr.ok("a {color: pink;\nbackground: orange; }")
  tr.ok("a{color: pink;\nbackground: orange; }")
  tr.ok("@media print {a {color: pink;\nbackground: orange; } }")
  tr.ok("@media print{a{color: pink;\nbackground: orange; } }")

  // Ignore single-line
  tr.ok("a {}")
  tr.ok("a { }")
  tr.ok("@import url(x.css)")
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("@media print {\ta {\tcolor: pink; } }")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print {\na {color: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print {a {\ncolor: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
})

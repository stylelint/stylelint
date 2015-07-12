import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("@import url(x.css)")
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\r\ncolor: pink; }", "CRLF")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("a{\r\n  color: pink; }", "CRLF")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\r\na{\r\ncolor: pink; } }", "CRLF")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")
  tr.ok("a { /* 1 */\n  color: pink;\n}", "end-of-line comment")
  tr.ok("a {\n  /* 1 */\n  color: pink;\n}", "next-line comment")
  tr.ok("a {\r\n  /* 1 */\r\n  color: pink;\r\n}", "next-line comment and CRLF")

  tr.notOk("a { color: pink; }", messages.expectedAfter())
  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {  color: pink; }", messages.expectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print {\r\na { color: pink; } }", messages.expectedAfter(), "CRLF")
  tr.notOk(
    "a {  /* 1 */\n  color: pink;\n}",
    messages.expectedAfter(),
    "end-of-line comment with two spaces before"
  )
  tr.notOk(
    "a {  /* 1 */\r\n  color: pink;\r\n}",
    messages.expectedAfter(),
    "end-of-line comment with two spaces before and CRLF"
  )
  tr.notOk(
    "a { /* 1 */ color: pink; }",
    messages.expectedAfter(),
    "next node is comment without newline after"
  )
})

testRule("always-multi-line", tr => {
  warningFreeBasics(tr)

  // Regular "always" tests
  tr.ok("a {\ncolor: pink; }")
  tr.ok("a {\n  color: pink;\n  background: orange; }")
  tr.ok("a {\r\n  color: pink;\r\n  background: orange; }", "CRLF")
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print {\r\na {\r\ncolor: pink; } }", "CRLF")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")
  tr.ok("@media print{\r\n\ta{\r\n  color: pink; } }", "CRLF")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.expectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\r\nbackground: orange; }", messages.expectedAfterMultiLine(), "CRLF")
  tr.notOk("@media print { a {\ncolor:\npink; } }", messages.expectedAfterMultiLine())
  tr.notOk("@media print {\na { color:\npink; } }", messages.expectedAfterMultiLine())
  tr.notOk("@media print {\r\na { color:\r\npink; } }", messages.expectedAfterMultiLine(), "CRLF")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("a {  color: pink;  background: orange; }")
  tr.ok("a { /* 1 */ color: pink; }")
})

testRule("never-multi-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a {color: pink;\nbackground: orange; }")
  tr.ok("a {color: pink;\r\nbackground: orange; }", "CRLF")
  tr.ok("a{color: pink;\nbackground: orange; }")
  tr.ok("@media print {a {color: pink;\nbackground: orange; } }")
  tr.ok("@media print{a{color: pink;\nbackground: orange; } }")

  // Ignore single-line
  tr.ok("a { color: pink; }")
  tr.ok("a {  color: pink; }")
  tr.ok("a {\tcolor: pink; }")
  tr.ok("@media print { a { color: pink; } }")
  tr.ok("@media print {\ta {\tcolor: pink; } }")

  tr.notOk("a { color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\ncolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\r\ncolor: pink;\r\nbackground: orange; }", messages.rejectedAfterMultiLine(), "CRLF")
  tr.notOk("a {  color: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("a {\tcolor: pink;\nbackground: orange; }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print {\na {color: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
  tr.notOk("@media print {a {\ncolor: pink;\nbackground: orange; } }", messages.rejectedAfterMultiLine())
})

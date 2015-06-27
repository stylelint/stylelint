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
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("@media print {\na {\ncolor: pink; } }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n\ta{\n  color: pink; } }")
  tr.ok("a { /* 1 */\n  color: pink;\n}", "end-of-line comment")
  tr.ok("a {\n  /* 1 */\n  color: pink;\n}", "next-line comment")

  tr.notOk("a { color: pink; }", messages.expectedAfter())
  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {  color: pink; }", messages.expectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
  tr.notOk(
    "a {  /* 1 */\n  color: pink;\n}",
    messages.expectedAfter(),
    "end-of-line comment with two spaces before"
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
  tr.ok("a { /* 1 */ color: pink; }")
})

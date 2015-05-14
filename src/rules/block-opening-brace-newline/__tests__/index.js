import { ruleTester } from "../../../testUtils"
import blockOpeningBraceNewline, { ruleName, messages } from ".."

const testBlockOpeningBraceNewline = ruleTester(blockOpeningBraceNewline, ruleName)

testBlockOpeningBraceNewline({ before: "always" }, tr => {
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

testBlockOpeningBraceNewline({ after: "always" }, tr => {
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

testBlockOpeningBraceNewline({ before: "never" }, tr => {
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

testBlockOpeningBraceNewline({ after: "never" }, tr => {
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

testBlockOpeningBraceNewline({ before: "always", after: "always" }, tr => {
  tr.ok("a\n{\ncolor: pink; }")
  tr.ok("a\n{\n\tcolor: pink; }")
  tr.ok("@media print\n{\na\n{\ncolor: pink; } }")
  tr.ok("@media print\n{\n  a\n{\n  color: pink; } }")

  tr.notOk("a{\ncolor: pink; }", messages.expectedBefore())
  tr.notOk("a {\ncolor: pink; }", messages.expectedBefore())
  tr.notOk("a\n{color: pink; }", messages.expectedAfter())
  tr.notOk("a\n{ color: pink; }", messages.expectedAfter())
  tr.notOk("@media print\n{ a\n{\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print {\na\n{\ncolor: pink; } }", messages.expectedBefore())
  tr.notOk("@media print\n{\na\n{ color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print\n{\na {\ncolor: pink; } }", messages.expectedBefore())
})

testBlockOpeningBraceNewline({ before: "always", after: "never" }, tr => {
  tr.ok("a\n{color: pink; }")
  tr.ok("@media print\n{a\n{color: pink; } }")

  tr.notOk("a{color: pink; }", messages.expectedBefore())
  tr.notOk("a {color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("a\n{ color: pink; }", messages.rejectedAfter())
  tr.notOk("@media print\n{ a\n{color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a\n{color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print\n{a\n{ color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print\n{a {color: pink; } }", messages.expectedBefore())
})

testBlockOpeningBraceNewline({ before: "never", after: "always" }, tr => {
  tr.ok("a{\ncolor: pink; }")
  tr.ok("a{\n  color: pink; }")
  tr.ok("a{\n\tcolor: pink; }")
  tr.ok("@media print{\na{\ncolor: pink; } }")
  tr.ok("@media print{\n  a{\n  color: pink; } }")
  tr.ok("@media print{\n\ta{\n\tcolor: pink; } }")

  tr.notOk("a\n{\ncolor: pink; }", messages.rejectedBefore())
  tr.notOk("a {\ncolor: pink; }", messages.rejectedBefore())
  tr.notOk("a{ color: pink; }", messages.expectedAfter())
  tr.notOk("a{color: pink; }", messages.expectedAfter())
  tr.notOk("@media print{ a{\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print\n{\na{\ncolor: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{\na{ color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print{\na\n{\ncolor: pink; } }", messages.rejectedBefore())
})

testBlockOpeningBraceNewline({ before: "never", after: "never" }, tr => {
  tr.ok("a{color: pink; }")
  tr.ok("@media print{a{color: pink; } }")

  tr.notOk("a\n{color: pink; }", messages.rejectedBefore())
  tr.notOk("a {color: pink; }", messages.rejectedBefore())
  tr.notOk("a{\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("a{ color: pink; }", messages.rejectedAfter())
  tr.notOk("@media print{\na{color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print\n{a{color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{a{\ncolor: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print{a\n{color: pink; } }", messages.rejectedBefore())
})

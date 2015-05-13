import { ruleTester } from "../../../testUtils"
import blockOpeningBraceSpace, { ruleName, messages } from ".."

const testBlockOpeningBraceSpace = ruleTester(blockOpeningBraceSpace, ruleName)

testBlockOpeningBraceSpace({ before: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", messages.expectedBefore())
  tr.notOk("a  { color: pink; }", messages.expectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.expectedBefore())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.expectedBefore())
})

testBlockOpeningBraceSpace({ before: "never" }, tr => {
  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a  { color: pink; }", messages.rejectedBefore())
  tr.notOk("a\t{ color: pink; }", messages.rejectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.rejectedBefore())
  tr.notOk("@media print { a{ color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{ a { color: pink; } }", messages.rejectedBefore())
})

testBlockOpeningBraceSpace({ after: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {  color: pink; }", messages.expectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.expectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
})

testBlockOpeningBraceSpace({ after: "never" }, tr => {
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedAfter())
  tr.notOk("a {  color: pink; }", messages.rejectedAfter())
  tr.notOk("a {\tcolor: pink; }", messages.rejectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("@media print {\na {color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a {\ncolor: pink; } }", messages.rejectedAfter())
})

testBlockOpeningBraceSpace({ before: "always", after: "always" }, tr => {
  tr.ok("a { color: pink; }")
  tr.ok("@media print { a { color: pink; } }")

  tr.notOk("a{ color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.expectedBefore())
  tr.notOk("a {color: pink; }", messages.expectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print {\na { color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print\n{ a { color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print { a {\ncolor: pink; } }", messages.expectedAfter())
  tr.notOk("@media print { a\n{ color: pink; } }", messages.expectedBefore())
})

testBlockOpeningBraceSpace({ before: "always", after: "never" }, tr => {
  tr.ok("a {color: pink; }")
  tr.ok("@media print {a {color: pink; } }")

  tr.notOk("a{color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{color: pink; }", messages.expectedBefore())
  tr.notOk("a  {color: pink; }", messages.expectedBefore())
  tr.notOk("a\n{color: pink; }", messages.expectedBefore())
  tr.notOk("a { color: pink; }", messages.rejectedAfter())
  tr.notOk("a {\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("@media print {a { color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print { a {color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a{color: pink; } }", messages.expectedBefore())
  tr.notOk("@media print{a {color: pink; } }", messages.expectedBefore())
})

testBlockOpeningBraceSpace({ before: "never", after: "always" }, tr => {
  tr.ok("a{ color: pink; }")
  tr.ok("@media print{ a{ color: pink; } }")

  tr.notOk("a { color: pink; }", messages.rejectedBefore())
  tr.notOk("a\n{ color: pink; }", messages.rejectedBefore())
  tr.notOk("a{color: pink; }", messages.expectedAfter())
  tr.notOk("a{  color: pink; }", messages.expectedAfter())
  tr.notOk("a{\ncolor: pink; }", messages.expectedAfter())
  tr.notOk("@media print{a{ color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print{ a{color: pink; } }", messages.expectedAfter())
  tr.notOk("@media print { a{ color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{ a { color: pink; } }", messages.rejectedBefore())
})

testBlockOpeningBraceSpace({ before: "never", after: "never" }, tr => {
  tr.ok("a{color: pink; }")
  tr.ok("@media print{a{color: pink; } }")

  tr.notOk("a {color: pink; }", messages.rejectedBefore())
  tr.notOk("a\n{color: pink; }", messages.rejectedBefore())
  tr.notOk("a{ color: pink; }", messages.rejectedAfter())
  tr.notOk("a{\ncolor: pink; }", messages.rejectedAfter())
  tr.notOk("@media print{a{ color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print{ a{color: pink; } }", messages.rejectedAfter())
  tr.notOk("@media print {a{color: pink; } }", messages.rejectedBefore())
  tr.notOk("@media print{a {color: pink; } }", messages.rejectedBefore())
})

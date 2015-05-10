import { ruleTester } from "../../../testUtils"
import blockOpeningBraceBefore, { ruleName, messages } from ".."

const testBlockOpeningBraceBefore = ruleTester(blockOpeningBraceBefore, ruleName)

const spaceMsg = messages.expected("space")
const newlineMsg = messages.expected("newline")

testBlockOpeningBraceBefore("space", tr => {
  tr.ok(
    "a { color: pink; }",
    "single space before rule's opening `{`"
  )
  tr.ok(
    "@media print { a { color: pink; } }",
    "single space before at-rule's and nested rule's opening `{`"
  )

  tr.notOk(
    "a{ color: pink; }",
    "no space before rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a  { color: pink; }",
    "multiple spaces before rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a\t{ color: pink; }",
    "tab before rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a\n{ color: pink; }",
    "newline before rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "@media print\n{ a { color: pink; } }",
    "newline before at-rule's opening `{` and single space before nested rule's",
    spaceMsg
  )
  tr.notOk(
    "@media print { a\n{ color: pink; } }",
    "single space before at-rule's opening `{` and newline before nested rule's",
    spaceMsg
  )
})

testBlockOpeningBraceBefore("newline", tr => {
  tr.ok(
    "a\n{ color: pink; }",
    "newline before rule's opening `{`"
  )
  tr.ok(
    "@media print\n{ a\n{ color: pink; } }",
    "newline space before at-rule's and nested rule's opening `{`"
  )

  tr.notOk(
    "a{ color: pink; }",
    "no space before rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a  { color: pink; }",
    "multiple spaces before rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a\t{ color: pink; }",
    "tab before rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a { color: pink; }",
    "single space before rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "@media print\n{ a { color: pink; } }",
    "newline before at-rule's opening `{` and single space before nested rule's",
    newlineMsg
  )
  tr.notOk(
    "@media print { a\n{ color: pink; } }",
    "single space before at-rule's opening `{` and newline before nested rule's",
    newlineMsg
  )
})

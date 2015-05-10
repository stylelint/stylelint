import { ruleTester } from "../../../testUtils"
import blockOpeningBraceAfter, { ruleName, messages } from ".."
import { expectSpaceTests } from "./oneWhitespace"

const testBlockOpeningBraceAfter = ruleTester(blockOpeningBraceAfter, ruleName)

const spaceMsg = messages.expected("space")
const newlineMsg = messages.expected("newline")

// Should pass the same tests as if the options were just "space"
testBlockOpeningBraceAfter({ singleLine: "space", multiLine: "space" }, expectSpaceTests)

testBlockOpeningBraceAfter({ singleLine: "space", multiLine: "newline" }, tr => {
  tr.ok(
    "a { color: pink; }",
    "space after single-line rule's opening `{`"
  )

  tr.ok(
    "a {\ncolor: pink;\nbackground: orange; }",
    "newline after muli-line rule's opening `{`"
  )
  tr.notOk(
    "a {color: pink;\nbackground: orange; }",
    "no space after multi-line rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a {\tcolor: pink;\nbackground: orange; }",
    "tab after multi-line rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a { color: pink;\nbackground: orange; }",
    "space after muli-line rule's opening `{`",
    newlineMsg
  )

  tr.ok(
    "@media print { a { color: pink; } }",
    "space after single-line at-rule's opening `{` and " +
    "its single-line nested rule's"
  )
  tr.ok(
    "@media print {\na {\ncolor: pink;\nbackground: orange; } }",
    "newline after multi-line at-rule's opening `{` and " +
    "its multi-line nested rule's"
  )
  tr.ok(
    "@media print {\na { color: pink; }\nspan { color: orange; } }",
    "newline after multi-line at-rule's opening `{` and " +
    "single space before the single-line nested rule's"
  )
  tr.notOk(
    "@media print {\na {color: pink; }\nspan { color: orange; } }",
    "newline after multi-line at-rule's opening `{` and " +
    "no space before one of the single-line nested rule's",
    spaceMsg
  )
  tr.notOk(
    "@media print { a {\ncolor: pink;\nbackground: orange; } }",
    "space after multi-line at-rule's opening `{` and " +
    "newline before the multi-line nested rule's",
    newlineMsg
  )
})

// ... It does not make sense to have `{ singleLine: "newline" }`

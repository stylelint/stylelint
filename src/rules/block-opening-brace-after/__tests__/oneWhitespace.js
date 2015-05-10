import { ruleTester } from "../../../testUtils"
import blockOpeningBraceAfter, { ruleName, messages } from ".."

const testBlockOpeningBraceAfter = ruleTester(blockOpeningBraceAfter, ruleName)

const spaceMsg = messages.expected("space")
const newlineMsg = messages.expected("newline")

testBlockOpeningBraceAfter("space", expectSpaceTests)

export function expectSpaceTests(tr) {
  tr.ok(
    "a { color: pink; }",
    "space after single-line rule's opening `{`"
  )
  tr.ok(
    "a {   color: pink; }",
    "multiple space after single-line rule's opening `{`"
  )
  tr.notOk(
    "a {color: pink; }",
    "no space after single-line rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a {\ncolor: pink; }",
    "newline after single-line rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a {\tcolor: pink; }",
    "tab after single-line rule's opening `{`",
    spaceMsg
  )

  tr.ok(
    "a { color: pink;\nbackground: orange; }",
    "space after muli-line rule's opening `{`"
  )
  tr.notOk(
    "a {color: pink;\nbackground: orange; }",
    "no space after muli-line rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a {\ncolor: pink;\nbackground: orange; }",
    "newline after muli-line rule's opening `{`",
    spaceMsg
  )
  tr.notOk(
    "a {\tcolor: pink;\nbackground: orange; }",
    "tab after muli-line rule's opening `{`",
    spaceMsg
  )

  tr.ok(
    "@media print { a { color: pink; } }",
    "space after single-line at-rule's opening `{` and " +
    "its single-line nested rule's"
  )
  tr.notOk(
    "@media print {\na { color: pink; } }",
    "newline after single-line at-rule's opening `{` and " +
    "single space before the single-line nested rule's",
    spaceMsg
  )
  tr.notOk(
    "@media print { a {\ncolor: pink; } }",
    "space after single-line at-rule's opening `{` and " +
    "newline before the single-line nested rule's",
    spaceMsg
  )
  tr.notOk(
    "@media print {a { color: pink; } }",
    "no space after single-line at-rule's opening `{` and " +
    "space before the single-line nested rule's",
    spaceMsg
  )
  tr.notOk(
    "@media print { a {\tcolor: pink; } }",
    "space after single-line at-rule's opening `{` and " +
    "tab before the single-line nested rule's",
    spaceMsg
  )
}

// If newline is always expected, all blocks should be multi-line blocks
testBlockOpeningBraceAfter("newline", tr => {
  // So only one single-line test is needed
  tr.notOk(
    "a { color: pink; }",
    "space after single-line rule's opening `{`",
    newlineMsg
  )

  tr.ok(
    "a {\ncolor: pink;\nbackground:orange; }",
    "newline after rule's opening `{`"
  )
  tr.notOk(
    "a {color: pink;\nbackground:orange; }",
    "no space after rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a { color: pink;\nbackground:orange; }",
    "space after rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a {\tcolor: pink; }",
    "tab after rule's opening `{`",
    newlineMsg
  )

  tr.ok(
    "a {\ncolor: pink;\nbackground: orange; }",
    "space after rule's opening `{`"
  )
  tr.notOk(
    "a {color: pink;\nbackground: orange; }",
    "no space after rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a { color: pink;\nbackground: orange; }",
    "space after rule's opening `{`",
    newlineMsg
  )
  tr.notOk(
    "a {\tcolor: pink;\nbackground: orange; }",
    "tab after rule's opening `{`",
    newlineMsg
  )

  tr.ok(
    "@media print {\na {\ncolor: pink; } }",
    "newline after at-rule's opening `{` and " +
    "its nested rule's"
  )
  tr.notOk(
    "@media print {\na { color: pink; } }",
    "newline after at-rule's opening `{` and " +
    "single space before the nested rule's",
    newlineMsg
  )
  tr.notOk(
    "@media print { a {\ncolor: pink; } }",
    "space after at-rule's opening `{` and " +
    "newline before the nested rule's",
    newlineMsg
  )
  tr.notOk(
    "@media print {a {\ncolor: pink; } }",
    "no space after at-rule's opening `{` and " +
    "newline before the nested rule's",
    newlineMsg
  )
  tr.notOk(
    "@media print {\na {\tcolor: pink; } }",
    "newline after at-rule's opening `{` and " +
    "tab before the nested rule's",
    newlineMsg
  )
})

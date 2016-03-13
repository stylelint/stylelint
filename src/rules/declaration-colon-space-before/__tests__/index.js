import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color :pink }", "space only before")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color :\npink }", "space before and newline after")
  tr.ok("a { color :\r\npink }", "space before and CRLF after")
  tr.ok(
    "$map:(key:value)",
    "SCSS map with no newlines"
  )
  tr.ok(
    "a { background : url(data:application/font-woff;...); }",
    "data URI"
  )

  tr.notOk(
    "a { color: pink; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 11,
    },
    "no space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 11,
    },
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 11,
    },
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    {
      message: messages.expectedBefore(),
      line: 2,
      column: 1,
    },
    "newline before"
  )
  tr.notOk(
    "a { color\r\n: pink; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 11,
    },
    "CRLF before"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color: pink }", "no space before and space after")
  tr.ok("a { color:\npink }", "no space before and newline after")
  tr.ok("a { color:\r\npink }", "no space before and CRLF after")
  tr.ok(
    "$map :(key :value)",
    "SCSS map with no newlines"
  )

  tr.notOk(
    "a { color : pink; }",
    {
      message: messages.rejectedBefore(),
      line: 1,
      column: 11,
    },
    "space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    {
      message: messages.rejectedBefore(),
      line: 1,
      column: 11,
    },
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    {
      message: messages.rejectedBefore(),
      line: 1,
      column: 11,
    },
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    {
      message: messages.rejectedBefore(),
      line: 2,
      column: 1,
    },
    "newline before"
  )
  tr.notOk(
    "a { color\r\n: pink; }",
    {
      message: messages.rejectedBefore(),
      line: 1,
      column: 11,
    },
    "CRLF before"
  )
})

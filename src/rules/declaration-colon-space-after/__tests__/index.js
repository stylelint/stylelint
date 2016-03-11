import {
  ruleTester,
  warningFreeBasics,
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink }", "space only after")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color\n: pink }", "newline before and space after")
  tr.ok("a { color\r\n: pink }", "CRLF before and space after")
  tr.ok(
    "$map:(key:value)",
    "SCSS map with no newlines"
  )
  tr.ok(
    "a { background: url(data:application/font-woff;...); }",
    "data URI"
  )

  tr.notOk(
    "a { color :pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "no space after"
  )
  tr.notOk(
    "a { color :  pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "newline after"
  )
  tr.notOk(
    "a { color :\r\npink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "CRLF after"
  )
  tr.notOk(
    "a { color:pink; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 11,
    },
    "no space after"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color :pink }", "space before and no space after")
  tr.ok("a { color\n:pink }", "newline before and no space after")
  tr.ok("a { color\r\n:pink }", "CRLF before and no space after")
  tr.ok(
    "$map: (key: value)",
    "SCSS map with no newlines"
  )

  tr.notOk(
    "a { color : pink; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 11,
    },
    "space after"
  )
  tr.notOk(
    "a { color:  pink; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 11,
    },
    "two spaces after"
  )
  tr.notOk(
    "a { color :\tpink; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 11,
    },
    "tab after"
  )
  tr.notOk(
    "a { color :\npink; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 11,
    },
    "newline after"
  )
  tr.notOk(
    "a { color :\r\npink; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 11,
    },
    "CRLF after"
  )
})

testRule("always-single-line", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink }", "space only after single-line")
  tr.ok("a { transition: color 1s,\n\twidth 2s; }", "space after mult-line")
  tr.ok("a { transition:color 1s,\n\twidth 2s; }", "no space after mult-line")
  tr.ok("a { transition:color 1s,\r\n\twidth 2s; }", "no space after mult-line CRLF")
  tr.ok("a { transition:\tcolor 1s,\n\twidth 2s; }", "tab after mult-line")

  tr.notOk(
    "a { color :pink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "no space after single-line"
  )
  tr.notOk(
    "a { color :  pink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "two spaces after single-line"
  )
  tr.notOk(
    "a { color :\tpink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "tab after single-line"
  )
  tr.notOk(
    "a { color :\npink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "newline after single-line"
  )
  tr.notOk(
    "a { color :\r\npink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "CRLF after single-line"
  )
  tr.notOk(
    "a { color:pink; }",
    {
      message: messages.expectedAfterSingleLine(),
      line: 1,
      column: 11,
    },
    "no space after"
  )
})

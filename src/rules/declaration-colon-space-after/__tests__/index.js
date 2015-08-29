import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink }", "space only after")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color\n: pink }", "newline before and space after")
  tr.ok("a { color\r\n: pink }", "CRLF before and space after")

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
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color :pink }", "space before and no space after")
  tr.ok("a { color\n:pink }", "newline before and no space after")
  tr.ok("a { color\r\n:pink }", "CRLF before and no space after")

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

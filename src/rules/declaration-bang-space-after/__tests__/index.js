import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink! important; }", "space only after")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink\n! important; }", "newline before and space after")
  tr.ok("a { color: pink\r\n! important; }", "CRLF before and space after")

  tr.notOk(
    "a { color: pink!important; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 16,
    },
    "no space after"
  )
  tr.notOk(
    "a { color: pink!  important; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 16,
    },
    "two spaces after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 16,
    },
    "newline after"
  )
  tr.notOk(
    "a { color: pink!\r\nimportant; }",
    {
      message: messages.expectedAfter(),
      line: 1,
      column: 16,
    },
    "CRLF after"
  )

  tr.ok("a::before { content: \"!!!\" ! important; }", "ignores string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no space before or after")
  tr.ok("a { color: pink !important; }", "space before and none after")
  tr.ok("a { color: pink\n!important; }", "newline before and none after")
  tr.ok("a { color: pink\r\n!important; }", "CRLF before and none after")

  tr.notOk(
    "a { color: pink! important; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 16,
    },
    "space after"
  )
  tr.notOk(
    "a { color: pink!\nimportant; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 16,
    },
    "newline after"
  )
  tr.notOk(
    "a { color: pink!\r\nimportant; }",
    {
      message: messages.rejectedAfter(),
      line: 1,
      column: 16,
    },
    "CRLF after"
  )
})

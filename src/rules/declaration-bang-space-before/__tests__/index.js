import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink !important; }", "space only before")
  tr.ok("a { color: pink ! important; }", "space before and after")
  tr.ok("a { color: pink !\nimportant; }", "space before and newline after")
  tr.ok("a { color: pink !\r\nimportant; }", "space before and CRLF after")

  tr.notOk(
    "a { color: pink  !important; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 18,
    },
    "two spaces before"
  )
  tr.notOk(
    "a { color: pink!important; }",
    {
      message: messages.expectedBefore(),
      line: 1,
      column: 16,
    },
    "no space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    {
      message: messages.expectedBefore(),
      line: 2,
      column: 1,
    },
    "newline before"
  )
  tr.notOk(
    "a { color: pink\r\n!important; }",
    {
      message: messages.expectedBefore(),
      line: 2,
      column: 1,
    },
    "CRLF before"
  )

  tr.ok("a::before { content: \"!!!\" !important; }", "ignores string")
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color: pink; }", "no !important")
  tr.ok("a { color: pink!important; }", "no spaces")
  tr.ok("a { color: pink! important; }", "no space before and after")
  tr.ok("a { color: pink!\nimportant; }", "no space before and newline after")
  tr.ok("a { color: pink!\r\nimportant; }", "no space before and CRLF after")

  tr.notOk(
    "a { color: pink !important; }",
    {
      message: messages.rejectedBefore(),
      line: 1,
      column: 17,
    },
    "space before"
  )
  tr.notOk(
    "a { color: pink\n!important; }",
    {
      message: messages.rejectedBefore(),
      line: 2,
      column: 1,
    },
    "newline before"
  )
  tr.notOk(
    "a { color: pink\r\n!important; }",
    {
      message: messages.rejectedBefore(),
      line: 2,
      column: 1,
    },
    "CRLF before"
  )
})

import {
  ruleTester,
  warningFreeBasics
} from "../../../testUtils"
import rule, { ruleName, messages } from ".."

const testRule = ruleTester(rule, ruleName)

testRule("always", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color :pink }", "space only before")
  tr.ok("a { color : pink }", "space before and after")
  tr.ok("a { color :\npink }", "space before and newline after")
  tr.ok("a { color :\r\npink }", "space before and CRLF after")

  tr.notOk(
    "a { color: pink; }",
    messages.expectedBefore(),
    "no space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    messages.expectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    messages.expectedBefore(),
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    messages.expectedBefore(),
    "newline before"
  )
  tr.notOk(
    "a { color\r\n: pink; }",
    messages.expectedBefore(),
    "CRLF before"
  )
})

testRule("never", tr => {
  warningFreeBasics(tr)

  tr.ok("a { color:pink }", "no space before and after")
  tr.ok("a { color: pink }", "no space before and space after")
  tr.ok("a { color:\npink }", "no space before and newline after")
  tr.ok("a { color:\r\npink }", "no space before and CRLF after")

  tr.notOk(
    "a { color : pink; }",
    messages.rejectedBefore(),
    "space before"
  )
  tr.notOk(
    "a { color  : pink; }",
    messages.rejectedBefore(),
    "two spaces before"
  )
  tr.notOk(
    "a { color\t: pink; }",
    messages.rejectedBefore(),
    "tab before"
  )
  tr.notOk(
    "a { color\n: pink; }",
    messages.rejectedBefore(),
    "newline before"
  )
  tr.notOk(
    "a { color\r\n: pink; }",
    messages.rejectedBefore(),
    "CRLF before"
  )
})
